import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { RegisterUser } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    console.log('find by email');
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
    const { email, fullName, role } = registerDto;
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
    const user = this.userRepository.create({
      email,
      fullName,
      role: userRole,
      password,
    });
    return this.userRepository.save(user);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
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
          ? (Object.keys(projection) as (keyof User)[])
          : undefined,
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
    const existUser = await this.userRepository.findOneBy({ id });
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
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const existUser = await this.userRepository.findOneBy({ id });
    if (!existUser) {
      throw new RpcException('User Not Found !');
    }
    return this.userRepository.update({ id }, { isDeleted: true });
  }
}
