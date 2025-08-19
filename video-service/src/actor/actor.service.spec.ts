import { Test, TestingModule } from '@nestjs/testing';
import { ActorService } from './actor.service';
import { ContentService } from 'src/content/content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
jest.mock('api-query-params', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      filter: {},
      population: [],
      sort: {},
      projection: {},
      skip: 0,
      limit: 10,
    })),
  };
});
describe('ActorService', () => {
  let service: ActorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorService,
        { provide: getRepositoryToken(Actor), useValue: {} },
        { provide: ContentService, useValue: {} },
      ],
    }).compile();

    service = module.get<ActorService>(ActorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
