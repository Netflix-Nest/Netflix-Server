import { Module } from "@nestjs/common";
import { InteractionController } from "./interaction.controller";
import { InteractionClientModule } from "@netflix-clone/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    InteractionClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        urls: [cfg.get<string>("RMQ_URL") || "amqp://netflix-rabbitmq:5672"],
        queue: cfg.get<string>("INTERACTION_QUEUE") || "interaction_queue",
        queueOptions: {
          durable: true,
        },
      }),
    }),
  ],
  controllers: [InteractionController],
  providers: [],
})
export class InteractionModule {}
