import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const StorageClientProvider = {
  provide: "STORAGE_SERVICE",
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          configService.get<string>("STORAGE_SERVICE_URL") ||
            "amqp://localhost:5672",
        ],
        queue:
          configService.get<string>("STORAGE_SERVICE_QUEUE") || "storage_queue",
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};
