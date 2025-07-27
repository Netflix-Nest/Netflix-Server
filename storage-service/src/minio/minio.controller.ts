import { Controller } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @MessagePattern('upload-video')
  async handleUpload(@Payload() data) {
    const { originalname, base64, mimetype } = data;
    const filename = Date.now() + '-' + originalname;
    const buffer = Buffer.from(base64, 'base64');
    await this.minioService.upload('video-bucket', filename, buffer, mimetype);
    return {
      url: await this.minioService.getPresignedUrl('video-bucket', filename),
      filename,
    };
  }
}
