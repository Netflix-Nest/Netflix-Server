import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CommentClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        host: cfg.get<string>("REDIS_HOST") || "netflix-redis",
        port: cfg.get<number>("REDIS_PORT") || 6379,
        password: cfg.get<string>("REDIS_PASSWORD"),
      }),
    }),
  ],
  controllers: [CommentController],
  providers: [],
})
export class CommentModule {}
