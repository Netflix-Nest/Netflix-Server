import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Content } from 'src/content/entities/content.entity';
import { Series } from 'src/series/entities/series.entity';
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
describe('GenreController', () => {
  let controller: GenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        GenreService,
        {
          provide: getRepositoryToken(Genre),
          useValue: {},
        },
        { provide: getRepositoryToken(Content), useValue: {} },
        { provide: getRepositoryToken(Series), useValue: {} },
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
