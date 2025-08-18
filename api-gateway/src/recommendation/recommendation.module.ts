import { Module } from "@nestjs/common";
import { RecommendationController } from "./recommendation.controller";
import { RecommendationClientProvider } from "src/client/recommendation-client.provider";

@Module({
	controllers: [RecommendationController],
	providers: [RecommendationClientProvider],
})
export class RecommendationModule {}
