import { Test, TestingModule } from '@nestjs/testing';
import { InteractionService } from './interaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Content } from 'src/content/entities/content.entity';

describe('InteractionService', () => {
  let service: InteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionService,
        { provide: getRepositoryToken(Content), useValue: {} },
      ],
    }).compile();

    service = module.get<InteractionService>(InteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
