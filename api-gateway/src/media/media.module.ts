import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { StorageClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		StorageClientModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (cfg: ConfigService) => ({
				urls: [
					cfg.get<string>("RMQ_URL") ||
						"amqp://netflix-rabbitmq:5672",
				],
				queue: cfg.get<string>("STORAGE_QUEUE") || "storage_queue",
				queueOptions: {
					durable: true,
				},
			}),
		}),
	],
	controllers: [MediaController],
	providers: [],
})
export class MediaModule {}
