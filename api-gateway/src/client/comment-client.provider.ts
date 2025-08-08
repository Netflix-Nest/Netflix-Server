import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const CommentClientProvider = {
	provide: "COMMENT_SERVICE",
	useFactory: (configService: ConfigService) => {
		return ClientProxyFactory.create({
			transport: Transport.REDIS,
			options: {
				host:
					configService.get<string>("COMMENT_SERVICE_HOST") ||
					"localhost",
				port: configService.get<number>("COMMENT_SERVICE_PORT") || 6379,
			},
		});
	},
	inject: [ConfigService],
};
