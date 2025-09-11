import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "@netflix-clone/common";
import { IUserDecorator } from "@netflix-clone/types";
import { lastValueFrom } from "rxjs";

@Controller("recommendation")
export class RecommendationController {
  constructor(
    @Inject("RECOMMENDATION_SERVICE")
    private readonly recommendationClient: ClientProxy
  ) {}
  @Post()
  recommend(
    @User() user: IUserDecorator,
    @Query("current") page: number,
    @Query("pageSize") limit: number,
    @Body() data: any
  ) {
    if (!data) {
      data = { ids: [] };
    }
    return lastValueFrom(
      this.recommendationClient.send("recommend", {
        id: user.userId,
        page,
        limit,
        excludeIds: data.ids ?? [],
      })
    );
  }
}
