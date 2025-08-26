import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  JobClientModule,
  StorageClientModule,
  VideoClientModule,
} from "@netflix-clone/common";

@Module({
  imports: [
    ConfigModule,
    VideoClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("VIDEO_QUEUE") || "video_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
    StorageClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("STORAGE_QUEUE") || "storage_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
    JobClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("JOB_QUEUE") || "job_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [VideoController],
})
export class VideoModule {}
