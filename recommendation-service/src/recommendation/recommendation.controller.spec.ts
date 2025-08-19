import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

describe('RecommendationController', () => {
  let controller: RecommendationController;
  const mockUserClient = {
    send: jest.fn(),
  };
  const mockVideoClient = {
    send: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationController],
      providers: [
        RecommendationService,
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
        },
        {
          provide: 'VIDEO_SERVICE',
          useValue: mockVideoClient,
        },
      ],
    }).compile();

    controller = module.get<RecommendationController>(RecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
