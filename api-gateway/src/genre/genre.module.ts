import { Module } from "@nestjs/common";
import { VideoClientProvider } from "src/client/video-client.provider";
import { GenreController } from "./genre.controller";

@Module({
	controllers: [GenreController],
	providers: [VideoClientProvider],
})
export class GenreModule {}
