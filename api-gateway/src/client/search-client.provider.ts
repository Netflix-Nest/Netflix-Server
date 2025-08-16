import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const SearchClientProvider = {
	provide: "SEARCH_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [
					configService.get<string>("SEARCH_SERVICE_URL") ||
						"amqp://netflix-rabbitmq:5672",
				],
				queue:
					configService.get<string>("SEARCH_SERVICE_QUEUE") ||
					"search_queue",
				queueOptions: {
					durable: true,
				},
			},
		});
	},
	inject: [ConfigService],
};
