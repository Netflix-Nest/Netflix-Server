import { Module } from "@nestjs/common";
import { ActorController } from "./actor.controller";
import { VideoClientProvider } from "src/client/video-client.provider";

@Module({
	controllers: [ActorController],
	providers: [VideoClientProvider],
})
export class ActorModule {}
