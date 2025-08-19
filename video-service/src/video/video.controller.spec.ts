import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
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
describe('VideoController', () => {
  let controller: VideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        VideoService,
        { provide: ContentService, useValue: {} },
        { provide: getRepositoryToken(Video), useValue: {} },
      ],
    }).compile();

    controller = module.get<VideoController>(VideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
