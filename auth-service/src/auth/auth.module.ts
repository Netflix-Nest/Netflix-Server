import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import ms, { StringValue } from 'ms';
import { UserClientModule } from '@netflix-clone/common';

@Module({
  imports: [
    // PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_ACCESS_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    UserClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        host: cfg.get<string>('REDIS_HOST') || 'netflix-redis',
        port: cfg.get<number>('REDIS_PORT') || 6379,
        password: cfg.get<string>('REDIS_PASSWORD'),
        serializer: {
          serialize: (value) => JSON.stringify(value),
          deserialize: (value) => JSON.parse(value),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
