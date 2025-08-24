import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '@netflix-clone/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusUser, User, UserRole } from './entities/user.entity';
import { In, Like, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('ENGAGEMENT_SERVICE')
    private readonly engagementClient: ClientProxy,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async updateUserToken(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new RpcException('User not found !');
    }
    return await this.userRepository.update(
      { id: userId },
      { refreshToken: refreshToken },
    );
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new RpcException('User not found !');
    }
    return user;
  }

  async removeToken(id: number) {
    await this.userRepository.update({ id: id }, { refreshToken: '' });
  }

  async getUserByToken(refreshToken: string) {
    return this.userRepository.findOneBy({ refreshToken });
  }

  async registerUser(registerDto: CreateUserDto) {
    const {
      email,
      fullName,
      role,
      avatar,
      phoneNumber,
      viewingTime,
      username,
      favoriteGenre = [],
    } = registerDto;

    const existUser = await this.userRepository.findOne({ where: { email } });
    if (existUser) {
      throw new RpcException('User already exist !');
    }
    const password = this.getHashPassword(registerDto.password);
    let userRole: UserRole;
    if (role === UserRole.ADMIN) {
      userRole = UserRole.ADMIN;
    } else if (role === UserRole.USER) {
      userRole = UserRole.USER;
    } else {
      userRole = UserRole.USER;
    }
    const status = StatusUser.PENDING;
    const user = this.userRepository.create({
      email,
      fullName,
      username,
      role: userRole,
      password,
      avatar,
      phoneNumber,
      viewingTime,
      status,
      favoriteGenre,
    });
    await this.userRepository.save(user);
    const createWatchlistDto = {
      userId: user.id,
      contentIds: [],
      name: 'My Favorite',
      thumbnailUrl: '',
    };
    await lastValueFrom(
      this.engagementClient.send('create-watchlist', createWatchlistDto),
    );
    return user;
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.userRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const users = await this.userRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof User)[]).filter(
              (f) => f !== 'password',
            )
          : this.userRepository.metadata.columns
              .map((col) => col.propertyName as keyof User)
              .filter((col) => col !== 'password'),
    });

    return {
      meta: {
        currentPage: +currentPage,
        pageSize: defaultLimit,
        totalItems,
        totalPages,
      },
      data: users,
    };
  }

  async findOne(id: number) {
    const allColumns = this.userRepository.metadata.columns.map(
      (col) => col.propertyName as keyof User,
    );
    const existUser = await this.userRepository.findOne({
      where: { id },
      select: allColumns.filter((c) => c !== 'password'),
    });
    if (!existUser) {
      throw new RpcException('User Not Found !');
    }
    return existUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) {
      throw new RpcException('User Not Found !');
    }
    if (updateUserDto.email && updateUserDto.email !== existUser.email) {
      const emailUsed = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (emailUsed && emailUsed.id !== id) {
        throw new RpcException('Email already in use!');
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = this.getHashPassword(updateUserDto.password);
    }

    if (updateUserDto.viewingTime) {
      updateUserDto.viewingTime += existUser.viewingTime;
    }
    await this.userRepository.update({ id }, { ...updateUserDto });
    return this.findOne(id);
  }

  async remove(id: number) {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) {
      throw new RpcException('User Not Found !');
    }
    return this.userRepository.softDelete(id);
  }

  async searchUsername(username: string) {
    return this.userRepository.find({
      where: { username: Like(`%${username}%`) },
      select: ['id', 'username', 'fullName', 'avatar'],
      take: 10,
    });
  }

  async findByIds(ids: number[]) {
    return this.userRepository.find({
      where: { id: In(ids) },
      select: ['fullName', 'email'],
    });
  }
}
