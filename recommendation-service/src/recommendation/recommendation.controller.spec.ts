import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

describe('RecommendationController', () => {
  let controller: RecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationController],
      providers: [RecommendationService],
    }).compile();

    controller = module.get<RecommendationController>(RecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
