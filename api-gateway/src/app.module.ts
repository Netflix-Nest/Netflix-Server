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
import { InteractionModule } from './interaction/interaction.module';
import { EngagementModule } from './engagement/engagement.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { SearchModule } from './search/search.module';

@Module({
	imports: [
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
	],
})
export class AppModule {}
