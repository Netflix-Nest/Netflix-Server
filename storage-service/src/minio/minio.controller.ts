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
    const fileName = Date.now() + '-' + originalname;
    const buffer = Buffer.from(base64, 'base64');
    const url = await this.minioService.upload(
      'video-bucket',
      fileName,
      buffer,
      mimetype,
    );

    return {
      url,
      fileName,
    };
  }

  @MessagePattern('get-video-url')
  async handleGetUrlVideo(
    @Payload() { bucket, fileName }: { bucket: string; fileName: string },
  ) {
    return this.minioService.getVideoUrl(bucket, fileName);
  }
}
