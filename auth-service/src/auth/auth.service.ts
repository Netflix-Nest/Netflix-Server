import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { compare } from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import {
  IUser,
  IUserDecorator,
  StatusUser,
  TokenType,
} from '@netflix-clone/types';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
@Injectable()
export class AuthService {
  private authTokenSecret: string | undefined;
  private authTokenExpire: string;
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private configService: ConfigService,
  ) {
    this.authTokenSecret = this.configService.get<string>(
      'JWT_AUTH_TOKEN_SECRET',
    );
    this.authTokenExpire =
      this.configService.get<string>('JWT_AUTH_EXPIRE') ?? '15m';
  }

  async validateUser(email: string, pass: string) {
    const user = await lastValueFrom(
      this.userClient.send('get-user-by-email', email),
    );
    if (user.status === 'BANNED') {
      throw new RpcException(new NotAcceptableException('Account banned !'));
    } else if (user.status === 'PENDING') {
      throw new RpcException(
        new NotAcceptableException('Account is inactive !'),
      );
    }
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

  async genAuthToken(id: number, type: TokenType) {
    const user = await lastValueFrom(this.userClient.send('find-user', id));
    if (
      type === TokenType.VERIFY_ACCOUNT &&
      (!user || user.status !== 'PENDING')
    ) {
      throw new RpcException('User not found !');
    }
    const token = this.jwtService.sign(
      { userId: id, type },
      {
        secret: this.authTokenSecret,
        expiresIn: this.authTokenExpire,
      },
    );
    return {
      token,
      email: user.email,
      name: user.fullName,
    };
  }

  async activeAccount(token: string) {
    try {
      const { userId, type } = this.jwtService.verify(token, {
        secret: this.authTokenSecret,
      });
      if (type !== TokenType.VERIFY_ACCOUNT) {
        throw new RpcException('Something is invalid !');
      }
      const user = await lastValueFrom(
        this.userClient.send('find-user', userId),
      );
      if (!user || user.status !== StatusUser.PENDING) {
        throw new RpcException("Can't active this account !");
      }
      await lastValueFrom(
        this.userClient.send('update-user', {
          id: userId,
          updateUserDto: { status: StatusUser.ACTIVE },
        }),
      );
      return 'Account active !';
    } catch (error) {
      throw new RpcException('Token has expired or invalid !');
    }
  }

  async resetPassword(token: string, password: string) {
    const { userId, type } = this.jwtService.verify(token, {
      secret: this.authTokenSecret,
    });
    if (type !== TokenType.RESET_PASSWORD) {
      throw new RpcException('Something is invalid !');
    }
    const user = await lastValueFrom(this.userClient.send('find-user', userId));

    await lastValueFrom(
      this.userClient.send('update-user', {
        id: userId,
        updateUserDto: { password },
      }),
    );
    return 'Password reset successfully !';
  }
}
