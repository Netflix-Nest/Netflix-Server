import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const AuthClientProvider = {
  provide: "AUTH_SERVICE",
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: configService.get<string>("AUTH_SERVICE_HOST") || "localhost",
        port: configService.get<number>("AUTH_SERVICE_PORT") || 6379,
      },
    });
  },
  inject: [ConfigService],
};
