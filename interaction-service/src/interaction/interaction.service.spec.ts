import { Test, TestingModule } from '@nestjs/testing';
import { InteractionService } from './interaction.service';

describe('InteractionService', () => {
  let service: InteractionService;
  const mockVideoService = {
    send: jest.fn(),
    emit: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionService,
        {
          provide: 'VIDEO_SERVICE',
          useValue: mockVideoService,
        },
      ],
    }).compile();

    service = module.get<InteractionService>(InteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
