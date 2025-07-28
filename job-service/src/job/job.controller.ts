import { Controller, Inject } from '@nestjs/common';
import { JobService } from './job.service';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class JobController {
  constructor(
    private readonly jobService: JobService,
    @Inject('STORAGE_SERVICE') private readonly storageClient: ClientProxy,
  ) {}
  @EventPattern('video-transcode')
  async handleTranscode(@Payload() payload: { fileName: string; url: string }) {
    const { fileName, url } = payload;
    // const inputPath = `/data/${bucket}/${fileName}`;
    try {
      const outputDir = `/app/outputs/${fileName}`;
      await this.jobService.transcodeToHLS(url, outputDir);
      console.log('Video transcode success !');
      //upload hls
      this.storageClient.emit('upload-hls-video', { outputDir, fileName });
    } catch (err) {
      console.log('Video transcode failed !');
    }
  }

  @MessagePattern('get-video-duration')
  async handleGetDuration(@Payload() inputPath: string) {
    console.log(inputPath);
    return this.jobService.getDuration(inputPath);
  }
}
