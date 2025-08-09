import { Test, TestingModule } from '@nestjs/testing';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';

describe('FcmController', () => {
  let controller: FcmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmController],
      providers: [FcmService],
    }).compile();

    controller = module.get<FcmController>(FcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
