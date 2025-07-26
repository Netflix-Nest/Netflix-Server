import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private readonly configService: ConfigService;
  constructor() {
    this.minioClient = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  async upload(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    return this.minioClient.putObject(bucket, fileName, buffer, buffer.length, {
      'Content-Type': mimeType,
    });
  }

  getPresignedUrl(bucket: string, fileName: string): Promise<string> {
    return this.minioClient.presignedPutObject(bucket, fileName, 60 * 5); // 5 minutes
  }

  async getObject(bucket: string, fileName: string) {
    return this.minioClient.getObject(bucket, fileName);
  }
}
