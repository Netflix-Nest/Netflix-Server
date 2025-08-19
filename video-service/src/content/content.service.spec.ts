import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from 'src/tag/entities/tag.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Series } from 'src/series/entities/series.entity';
import { Content } from './entities/content.entity';
import { Video } from 'src/video/entities/video.entity';
import { Actor } from 'src/actor/entities/actor.entity';
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
describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Actor),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Series),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Content),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Video),
          useValue: {},
        },
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: {},
        },
        { provide: 'SEARCH_SERVICE', useValue: {} },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
