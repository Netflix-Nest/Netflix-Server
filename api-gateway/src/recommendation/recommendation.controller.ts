import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("recommendation")
export class RecommendationController {
	constructor(
		@Inject("RECOMMENDATION_SERVICE")
		private readonly recommendationClient: ClientProxy
	) {}
	@Get()
	recommend(
		@Query("id") id: number,
		@Query("current") page: number,
		@Query("pageSize") limit: number
	) {
		return lastValueFrom(
			this.recommendationClient.send("recommend", { id, page, limit })
		);
	}
}
