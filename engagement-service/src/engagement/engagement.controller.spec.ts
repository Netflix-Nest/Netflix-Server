import { Test, TestingModule } from '@nestjs/testing';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';

describe('EngagementController', () => {
  let controller: EngagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EngagementController],
      providers: [EngagementService],
    }).compile();

    controller = module.get<EngagementController>(EngagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
