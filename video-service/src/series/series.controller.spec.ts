import { Test, TestingModule } from '@nestjs/testing';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { ContentService } from 'src/content/content.service';
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
describe('SeriesController', () => {
  let controller: SeriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [
        SeriesService,
        { provide: getRepositoryToken(Series), useValue: {} },
        { provide: ContentService, useValue: {} },
      ],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
