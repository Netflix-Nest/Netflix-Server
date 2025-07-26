import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const VideoClientProvider = {
  provide: "VIDEO_SERVICE",
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          configService.get<string>("VIDEO_SERVICE_URL") ||
            "amqp://localhost:5672",
        ],
        queue:
          configService.get<string>("VIDEO_SERVICE_QUEUE") || "video_queue",
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};
