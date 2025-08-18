import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const RecommendationClientProvider = {
	provide: "RECOMMENDATION_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [
					configService.get<string>("RECOMMENDATION_SERVICE_URL") ||
						"amqp://netflix-rabbitmq:5672",
				],
				queue:
					configService.get<string>("RECOMMENDATION_SERVICE_QUEUE") ||
					"recommendation_queue",
				queueOptions: {
					durable: true,
				},
			},
		});
	},
	inject: [ConfigService],
};
