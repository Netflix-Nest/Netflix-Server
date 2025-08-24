import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { VideoModule } from "./video/video.module";
import { ActorModule } from "./actor/actor.module";
import { ContentModule } from "./content/content.module";
import { GenreModule } from "./genre/genre.module";
import { SeriesModule } from "./serries/series.module";
import { TagModule } from "./tag/tag.module";
import { InteractionModule } from "./interaction/interaction.module";
import { EngagementModule } from "./engagement/engagement.module";
import { CommentModule } from "./comment/comment.module";
import { NotificationModule } from "./notification/notification.module";
import { SearchModule } from "./search/search.module";
import { RecommendationModule } from "./recommendation/recommendation.module";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";
import { RoleModule } from "./role/role.module";
import { PermissionModule } from "./permission/permission.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { RedisThrottlerStorage } from "./config/storage.throttler";
import { AppController } from "./app.controller";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: "netflix-redis",
            port: 6379,
          },
          ttl: 60,
        }),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        throttlers: [
          {
            name: "short",
            ttl: 1 * 1000, // 1s -> 3req
            limit: 3,
          },
          {
            name: "medium",
            ttl: 10 * 1000,
            limit: 20,
          },
          {
            name: "long",
            ttl: 60 * 1000,
            limit: 100,
          },
        ],
        storage: new RedisThrottlerStorage({
          host: cfg.get<string>("REDIS_HOST") || "localhost",
          port: cfg.get<number>("REDIS_PORT") || 6379,
          password: cfg.get<string>("REDIS_PASSWORD") || undefined,
        }),
      }),
    }),
    AuthModule,
    UserModule,
    VideoModule,
    ActorModule,
    ContentModule,
    GenreModule,
    SeriesModule,
    TagModule,
    InteractionModule,
    EngagementModule,
    CommentModule,
    NotificationModule,
    SearchModule,
    RecommendationModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
