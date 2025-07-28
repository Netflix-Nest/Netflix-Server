import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { VideoService } from './video.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @MessagePattern('create-video')
  async create(@Payload() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @MessagePattern('find-videos')
  async findAll(
    @Payload()
    {
      currentPage,
      limit,
      qs,
    }: {
      currentPage: number;
      limit: number;
      qs: string;
    },
  ) {
    return this.videoService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-video')
  async findOne(@Payload() id: number) {
    return this.videoService.findOne(id);
  }

  @MessagePattern('update-video')
  async update(
    @Payload()
    { id, updateVideoDto }: { id: number; updateVideoDto: UpdateVideoDto },
  ) {
    return this.videoService.update(id, updateVideoDto);
  }

  @MessagePattern('delete-video')
  async delete(@Payload() id: number) {
    return this.videoService.delete(id);
  }
}
