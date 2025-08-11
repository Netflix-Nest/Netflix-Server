import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const EngagementProvider = {
  provide: "ENGAGEMENT_SERVICE",
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          configService.get<string>("ENGAGEMENT_SERVICE_URL") ||
            "amqp://netflix-rabbitmq:5672",
        ],
        queue:
          configService.get<string>("ENGAGEMENT_SERVICE_QUEUE") ||
          "engagement_queue",
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};
