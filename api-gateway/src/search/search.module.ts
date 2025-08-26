import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    SearchClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("SEARCH_QUEUE") || "search_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [SearchController],
  providers: [],
})
export class SearchModule {}
