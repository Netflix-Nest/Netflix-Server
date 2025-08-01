import { Module } from "@nestjs/common";
import { VideoClientProvider } from "src/client/video-client.provider";
import { ContentController } from "./content.controller";

@Module({
	controllers: [ContentController],
	providers: [VideoClientProvider],
})
export class ContentModule {}
