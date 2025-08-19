import { Test, TestingModule } from '@nestjs/testing';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
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
describe('ActorController', () => {
  let controller: ActorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActorController],
      providers: [
        ActorService,
        { provide: getRepositoryToken(Actor), useValue: {} },
        { provide: ContentService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ActorController>(ActorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
