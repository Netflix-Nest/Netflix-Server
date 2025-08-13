import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const NotificationClientProvider = {
	provide: "NOTIFICATION_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [
					configService.get<string>("NOTIFICATION_SERVICE_URL") ||
						"amqp://netflix-rabbitmq:5672",
				],
				queue:
					configService.get<string>("NOTIFICATION_SERVICE_QUEUE") ||
					"notification_queue",
				queueOptions: {
					durable: true,
				},
			},
		});
	},
	inject: [ConfigService],
};
