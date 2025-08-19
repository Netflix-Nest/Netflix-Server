import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { ContentService } from 'src/content/content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
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
describe('VideoService', () => {
  let service: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        { provide: ContentService, useValue: {} },
        { provide: getRepositoryToken(Video), useValue: {} },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
