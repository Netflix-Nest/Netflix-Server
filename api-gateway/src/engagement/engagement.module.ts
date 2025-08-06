import { Module } from "@nestjs/common";
import { EngagementController } from "./engagement.controller";
import { EngagementProvider } from "src/client/engagement-client.provider";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [EngagementController],
  providers: [EngagementProvider],
})
export class EngagementModule {}
