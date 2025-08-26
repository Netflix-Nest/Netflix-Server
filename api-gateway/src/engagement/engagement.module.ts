import { Module } from "@nestjs/common";
import { EngagementController } from "./engagement.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EngagementClientModule } from "@netflix-clone/common";

@Module({
  imports: [
    ConfigModule,
    EngagementClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("ENGAGEMENT_QUEUE") || "engagement_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [EngagementController],
  providers: [],
})
export class EngagementModule {}
