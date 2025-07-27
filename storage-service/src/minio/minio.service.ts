import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: 'netflix-minio',
      port: 9000,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists('video-bucket');
  }

  async ensureBucketExists(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      Logger.log(`Bucket "${bucketName}" created.`);
    }
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

  async getPresignedUrl(bucket: string, fileName: string): Promise<string> {
    return this.minioClient.presignedGetObject(bucket, fileName, 60 * 120); // 120 minutes
  }

  async getObject(bucket: string, fileName: string) {
    return this.minioClient.getObject(bucket, fileName);
  }
}
