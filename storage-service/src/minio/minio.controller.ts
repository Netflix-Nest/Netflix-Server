import { Controller, Inject } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MinioController {
  constructor(
    private readonly minioService: MinioService,
    @Inject('JOB_SERVICE') private readonly jobClient: ClientProxy,
  ) {}

  @MessagePattern('upload-video')
  async handleUpload(@Payload() data) {
    const { originalname, base64, mimetype } = data;
    const filename = Date.now() + '-' + originalname;
    const buffer = Buffer.from(base64, 'base64');
    await this.minioService.upload('video-bucket', filename, buffer, mimetype);
    const url = await this.minioService.getPresignedUrl(
      'video-bucket',
      filename,
    );
    this.jobClient.emit('video-transcode', {
      bucket: 'video-bucket',
      fileName: filename,
      url,
    });

    return {
      url,
      filename,
    };
  }
}
