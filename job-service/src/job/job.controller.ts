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
    @Payload() payload: { bucket: string; fileName: string; url: string },
  ) {
    const { bucket, fileName, url } = payload;
    // const inputPath = `/data/${bucket}/${fileName}`;
    try {
      console.log('receive message 2....');
      console.log('start transcode.....');
      const outputDir = `/app/outputs/${fileName}`;
      const duration = await this.jobService.transcodeToHLS(url, outputDir);

      this.videoClient.emit('video-transcode-success', {
        fileName,
        outputDir,
      });
    } catch (err) {
      this.videoClient.emit('video-transcode-failed', {
        fileName,
        error: err.message,
      });
    }
  }
}
