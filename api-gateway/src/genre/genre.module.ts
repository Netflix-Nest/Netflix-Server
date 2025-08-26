import { Module } from "@nestjs/common";
import { GenreController } from "./genre.controller";
import { VideoClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
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
  ],
  controllers: [GenreController],
  providers: [],
})
export class GenreModule {}
