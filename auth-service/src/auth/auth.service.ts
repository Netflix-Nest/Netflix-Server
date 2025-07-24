import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compare } from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import { IUser, IUserDecorator } from './auth.interfaces';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { Response } from 'express';
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

  async login(user: IUser, response: Response) {
    const { id, email, fullName, role, avatar } = user;
    const payload = {
      sub: id,
      iss: 'Netflix Nest',
      email,
      fullName,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    console.log(refreshToken);
    await lastValueFrom(
      this.userClient.send('update-user-token', {
        refreshToken,
        userId: id,
      }),
    );
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(
        this.configService.get<StringValue>('JWT_REFRESH_EXPIRE') ?? '1d',
      ),
    });
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id,
        fullName,
        email,
        role,
        avatar,
      },
    };
  }
  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
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

        response.clearCookie('refresh_token');
        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          maxAge: ms(
            this.configService.get<StringValue>('JWT_REFRESH_EXPIRE') ?? '1d',
          ),
        });

        return {
          access_token: this.jwtService.sign(payload),
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

  async logout(user: IUserDecorator, response: Response) {
    await lastValueFrom(this.userClient.send('remove-token', user.userId));
    response.clearCookie('refresh_token');
    return 'ok';
  }
}
