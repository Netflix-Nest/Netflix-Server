import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const JobClientProvider = {
	provide: "JOB_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [
					configService.get<string>("JOB_SERVICE_URL") ||
						"amqp://netflix-rabbitmq:5672",
				],
				queue:
					configService.get<string>("JOB_SERVICE_QUEUE") ||
					"job_queue",
				queueOptions: {
					durable: true,
				},
			},
		});
	},
	inject: [ConfigService],
};
