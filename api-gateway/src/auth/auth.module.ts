import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./passport/local.strategy";
import { JwtStrategy } from "./passport/jwt.strategy";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  AuthClientModule,
  NotificationClientModule,
} from "@netflix-clone/common";

@Module({
  imports: [
    ConfigModule,
    AuthClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>("REDIS_HOST") || "netflix-redis",
        port: config.get<number>("REDIS_PORT") || 6379,
        password: config.get<string>("REDIS_PASSWORD"),
      }),
    }),
    NotificationClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("NOTIFICATION_QUEUE") || "notification_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [],
})
export class AuthModule {}
