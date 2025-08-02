import { forwardRef, Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Content } from 'src/content/entities/content.entity';
import { TagService } from 'src/tag/tag.service';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), forwardRef(() => ContentModule)],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
