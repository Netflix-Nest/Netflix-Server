import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import { VideoClientProvider } from "src/client/video-client.provider";
import { ConfigModule } from "@nestjs/config";
import { StorageClientProvider } from "src/client/storage-client.provider";
import { JobClientProvider } from "src/client/job-client.provider";

@Module({
	imports: [ConfigModule],
	controllers: [VideoController],
	providers: [VideoClientProvider, StorageClientProvider, JobClientProvider],
})
export class VideoModule {}
