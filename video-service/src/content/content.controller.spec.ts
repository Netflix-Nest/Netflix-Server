import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actor } from '../actor/entities/actor.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Series } from '../series/entities/series.entity';
import { Content } from './entities/content.entity';
import { Video } from 'src/video/entities/video.entity';
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
describe('ContentController', () => {
  let controller: ContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
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

    controller = module.get<ContentController>(ContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
