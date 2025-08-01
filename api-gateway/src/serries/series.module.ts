import { Module } from "@nestjs/common";
import { SeriesController } from "./series.controller";
import { VideoClientProvider } from "src/client/video-client.provider";

@Module({
	controllers: [SeriesController],
	providers: [VideoClientProvider],
})
export class SeriesModule {}
