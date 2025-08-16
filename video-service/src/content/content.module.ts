import { forwardRef, Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ActorModule } from 'src/actor/actor.module';
import { GenreModule } from 'src/genre/genre.module';
import { TagModule } from 'src/tag/tag.module';
import { VideoModule } from 'src/video/video.module';
import { SeriesModule } from 'src/series/series.module';
import { Actor } from 'src/actor/entities/actor.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Video } from 'src/video/entities/video.entity';
import { Series } from 'src/series/entities/series.entity';
import { NotificationClientProvider } from 'src/providers/notification-client.provider';
import { SearchClientProvider } from 'src/providers/search-client.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, Actor, Genre, Tag, Video, Series]),
    forwardRef(() => ActorModule),
    forwardRef(() => GenreModule),
    forwardRef(() => TagModule),
    forwardRef(() => VideoModule),
    forwardRef(() => SeriesModule),
  ],
  controllers: [ContentController],
  providers: [ContentService, NotificationClientProvider, SearchClientProvider],
  exports: [ContentService],
})
export class ContentModule {}
