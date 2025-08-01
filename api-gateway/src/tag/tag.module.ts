import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { VideoClientProvider } from "src/client/video-client.provider";

@Module({
	controllers: [TagController],
	providers: [VideoClientProvider],
})
export class TagModule {}
