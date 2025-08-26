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
import {
  NotificationClientModule,
  SearchClientModule,
} from '@netflix-clone/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, Actor, Genre, Tag, Video, Series]),
    forwardRef(() => ActorModule),
    forwardRef(() => GenreModule),
    forwardRef(() => TagModule),
    forwardRef(() => VideoModule),
    forwardRef(() => SeriesModule),
    NotificationClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>('RMQ_URL') || 'amqp://netflix-rabbitmq:5672'],
        queue: cfg.get<string>('NOTIFICATION_QUEUE') || 'notification_queue',
        queueOptions: {
          durable: true,
        },
      }),
    }),
    SearchClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>('RMQ_URL') || 'amqp://netflix-rabbitmq:5672'],
        queue: cfg.get<string>('SEARCH_QUEUE') || 'search_queue',
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
