import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
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
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

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
})
export class AppModule {}
