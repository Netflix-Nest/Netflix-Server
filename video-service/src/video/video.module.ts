import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Content } from 'src/content/entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Content])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
