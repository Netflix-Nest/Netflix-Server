import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { VideoService } from './video.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateVideoDto } from '@netflix-clone/types';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @MessagePattern('create-video')
  create(@Payload() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @MessagePattern('find-videos')
  findAll(
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

  @MessagePattern('find-by-ids')
  findByIds(@Payload() ids: number[]) {
    return this.videoService.findByIds(ids);
  }

  @MessagePattern('find-video')
  findOne(@Payload() id: number) {
    return this.videoService.findOne(id);
  }

  @MessagePattern('update-video')
  update(
    @Payload()
    { id, updateVideoDto }: { id: number; updateVideoDto: UpdateVideoDto },
  ) {
    return this.videoService.update(id, updateVideoDto);
  }

  @MessagePattern('delete-video')
  delete(@Payload() id: number) {
    return this.videoService.delete(id);
  }
}
