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
    await this.minioClient.putObject(bucket, fileName, buffer, buffer.length, {
      'Content-Type': mimeType,
    });
    // Get URL for others container in docker containers
    return this.minioClient.presignedGetObject(bucket, fileName, 60 * 120); // 120 minutes
  }

  // Get video URL for client
  async getVideoUrl(bucket: string, fileName: string): Promise<string> {
    // console.log('returning url.....');
    return this.minioClient.presignedGetObject(bucket, fileName, 60 * 120, {
      host: 'localhost:9000',
    });
    // return this.minioClient.presignedUrl('GET', bucket, fileName, 60 * 120, {
    //   host: 'localhost:9000',
    // });
  }

  async getObject(bucket: string, fileName: string) {
    return this.minioClient.getObject(bucket, fileName);
  }
}
