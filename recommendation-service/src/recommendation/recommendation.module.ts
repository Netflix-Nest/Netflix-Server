import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { UserClientModule, VideoClientModule } from '@netflix-clone/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        host: cfg.get<string>('REDIS_HOST') || 'netflix-redis',
        port: cfg.get<number>('REDIS_PORT') || 6379,
        password: cfg.get<string>('REDIS_PASSWORD'),
      }),
    }),
    VideoClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [
          cfg.get<string>('RABBITMQ_URL') || 'amqp://netflix-rabbitmq:5672',
        ],
        queue: cfg.get<string>('VIDEO_QUEUE') || 'video_queue',
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
