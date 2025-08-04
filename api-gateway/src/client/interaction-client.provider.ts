import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const InteractionProvider = {
	provide: "INTERACTION_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [
					configService.get<string>("INTERACTION_SERVICE_URL") ||
						"amqp://netflix-rabbitmq:5672",
				],
				queue:
					configService.get<string>("INTERACTION_SERVICE_QUEUE") ||
					"interaction_queue",
				queueOptions: {
					durable: true,
				},
			},
		});
	},
	inject: [ConfigService],
};
