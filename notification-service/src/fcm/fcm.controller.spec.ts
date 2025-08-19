import { Test, TestingModule } from '@nestjs/testing';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';

describe('FcmController', () => {
  let controller: FcmController;
  let credPath = jest.fn().mockReturnValue('');
  jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
  }));

  jest.mock('firebase-admin', () => {
    return {
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn().mockReturnValue('mock-credential'),
      },
      messaging: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue('mock-message-id'),
      }),
    };
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmController],
      providers: [
        FcmService,
        {
          provide: 'credPath',
          useValue: credPath,
        },
      ],
    }).compile();

    controller = module.get<FcmController>(FcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
