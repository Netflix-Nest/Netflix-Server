import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compare } from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import { IUser, IUserDecorator } from './auth.interfaces';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await lastValueFrom(
      this.userClient.send('get-user-by-email', email),
    );
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getAccount(user: IUserDecorator) {
    const userDb = await lastValueFrom(
      this.userClient.send('get-user-by-email', user.email),
    );
    return userDb;
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  };

  async login(user: IUser) {
    const { id, email, fullName, role, avatar } = user;
    const payload = {
      sub: id,
      iss: 'Netflix Nest',
      email,
      fullName,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    await lastValueFrom(
      this.userClient.send('update-user-token', {
        refreshToken,
        userId: id,
      }),
    );
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      user: {
        id,
        fullName,
        email,
        role,
        avatar,
      },
    };
  }

  processNewToken = async (refreshToken: string) => {
    try {
      //decoded token
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      //todo
      const user = await lastValueFrom(
        this.userClient.send('get-user-by-token', refreshToken),
      );
      if (user) {
        //update refresh token
        const { id, email, fullName, role, avatar } = user;
        const payload = {
          sub: id,
          iss: 'Netflix Nest',
          email,
          fullName,
          role,
        };
        const newRefreshToken = this.createRefreshToken(payload);
        //update user with refresh token
        await lastValueFrom(
          this.userClient.send('update-user-token', {
            refreshToken: newRefreshToken,
            userId: id,
          }),
        );

        return {
          accessToken: this.jwtService.sign(payload),
          refreshToken: newRefreshToken,
          user: {
            id,
            fullName,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException('Refresh token is invalid. Please login');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token is invalid. Please login');
    }
  };

  async logout(user: IUserDecorator) {
    this.userClient.emit('remove-token', user.userId);
  }
}
