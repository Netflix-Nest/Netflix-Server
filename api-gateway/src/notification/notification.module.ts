import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    NotificationClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("NOTIFICATION_QUEUE") || "notification_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [],
})
export class NotificationModule {}
