import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { ConfigService } from '@nestjs/config';

describe('BookmarkController', () => {
  let controller: BookmarkController;
  const mockBookmarkRepo = {
    findAll: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        BookmarkService,
        {
          provide: ConfigService,
          useValue: jest.fn().mockReturnValue('test'),
        },
        {
          provide: 'BookmarkRepository',
          useValue: mockBookmarkRepo,
        },
      ],
    }).compile();

    controller = module.get<BookmarkController>(BookmarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
