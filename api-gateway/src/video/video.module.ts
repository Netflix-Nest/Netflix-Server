import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import { VideoClientProvider } from "src/client/video-client.provider";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [VideoController],
  providers: [VideoClientProvider],
})
export class VideoModule {}
