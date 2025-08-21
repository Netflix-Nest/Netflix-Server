import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const UserClientProvider = {
	provide: "USER_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.REDIS,
			options: {
				host:
					configService.get<string>("USER_SERVICE_HOST") ||
					"localhost",
				port: configService.get<number>("USER_SERVICE_PORT") || 6379,
				password: configService.get<string>("USER_SERVICE_PASSWORD"),
			},
		});
	},
	inject: [ConfigService],
};
