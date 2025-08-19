import { Test, TestingModule } from '@nestjs/testing';
import { FcmService } from './fcm.service';

describe('FcmService', () => {
  let service: FcmService;
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
      providers: [FcmService],
    }).compile();

    service = module.get<FcmService>(FcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
