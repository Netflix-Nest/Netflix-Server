import { Module } from "@nestjs/common";
import { PermissionController } from "./permission.controller";
import { AuthClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    AuthClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        host: cfg.get<string>("REDIS_HOST") || "netflix-redis",
        port: cfg.get<number>("REDIS_PORT") || 6379,
        password: cfg.get<string>("REDIS_PASSWORD"),
      }),
    }),
  ],
  controllers: [PermissionController],
  providers: [],
})
export class PermissionModule {}
