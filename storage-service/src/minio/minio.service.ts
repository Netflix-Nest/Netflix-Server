import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('SERVER_IP') ?? 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists('video-bucket');
    await this.ensureBucketExists('hls-bucket');
    await this.setPublicPolicy('hls-bucket');
  }

  async setPublicPolicy(bucketName: string) {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));

    Logger.log(`Public read policy set for bucket: ${bucketName}`);
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
    return this.minioClient.presignedGetObject(bucket, fileName, 24 * 60 * 60); // 1 day
  }

  async getVideoUrl(bucket: string, fileName: string): Promise<string> {
    return this.minioClient.presignedGetObject(bucket, fileName, 24 * 60 * 60);
  }

  // async getObject(bucket: string, fileName: string) {
  //   return this.minioClient.getObject(bucket, fileName);
  // }

  async uploadHls(outputDir: string, fileName: string) {
    const bucket = 'hls-bucket';
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      const filePath = join(outputDir, file);
      const objectName = `${fileName}/${file}`;
      await this.minioClient.fPutObject(bucket, objectName, filePath, {});
    }
  }

  async getHlsUrl(fileName: string) {
    return this.minioClient.presignedUrl(
      'GET',
      'hls-bucket',
      `${fileName}/master.m3u8`,
    );
  }
}
