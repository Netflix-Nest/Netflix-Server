import { Controller, Inject } from '@nestjs/common';
import { JobService } from './job.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class JobController {
  constructor(
    private readonly jobService: JobService,
    @Inject('VIDEO_SERVICE') private readonly videoClient: ClientProxy,
  ) {}
  @MessagePattern('video-transcode')
  async handleTranscode(
    @Payload() payload: { videoPath: string; videoId: number },
  ) {
    const { videoPath, videoId } = payload;

    try {
      const outputDir = `/app/outputs/${videoId}`;
      await this.jobService.transcodeToHLS(videoPath, outputDir);

      this.videoClient.emit('video-transcode-success', {
        videoId,
        outputDir,
      });
    } catch (err) {
      this.videoClient.emit('video-transcode-failed', {
        videoId,
        error: err.message,
      });
    }
  }
}
