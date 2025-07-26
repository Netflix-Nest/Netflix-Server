import { Controller } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}
}
