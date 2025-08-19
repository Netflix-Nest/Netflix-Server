import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';

describe('RecommendationService', () => {
  let service: RecommendationService;
  const mockUserClient = {
    send: jest.fn(),
  };
  const mockVideoClient = {
    send: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RecommendationService>(RecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
