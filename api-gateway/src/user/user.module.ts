import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserClientModule } from "@netflix-clone/common";

@Module({
  imports: [
    ConfigModule,
    UserClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        host: cfg.get<string>("REDIS_HOST") || "netflix-redis",
        port: cfg.get<number>("REDIS_PORT") || 6379,
        password: cfg.get<string>("REDIS_PASSWORD"),
      }),
    }),
  ],
  controllers: [UserController],
})
export class UserModule {}
