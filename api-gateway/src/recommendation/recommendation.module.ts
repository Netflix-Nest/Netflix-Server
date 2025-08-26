import { Module } from "@nestjs/common";
import { RecommendationController } from "./recommendation.controller";
import { RecommendationClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    RecommendationClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue:
          cfg.get<string>("RECOMMENDATION_QUEUE") || "recommendation_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [RecommendationController],
  providers: [],
})
export class RecommendationModule {}
