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

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    forwardRef(() => ActorModule),
    forwardRef(() => GenreModule),
    forwardRef(() => TagModule),
    forwardRef(() => VideoModule),
    forwardRef(() => SeriesModule),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
