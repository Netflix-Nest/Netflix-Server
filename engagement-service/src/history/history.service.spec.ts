import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;
  const mockHistoryRepo = {
    findAll: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: 'HistoryRepository',
          useValue: mockHistoryRepo,
        },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
