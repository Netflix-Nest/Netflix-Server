import { Controller } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @MessagePattern('recommend')
  recommend(
    @Payload() { id, page, limit }: { id: number; page: number; limit: number },
  ) {
    return this.recommendationService.recommend(id, page, limit);
  }
}
