import { Module } from "@nestjs/common";
import { InteractionController } from "./interaction.controller";
import { InteractionProvider } from "src/client/interaction-client.provider";

@Module({
  controllers: [InteractionController],
  providers: [InteractionProvider],
})
export class InteractionModule {}
