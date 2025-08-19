import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';

describe('BookmarkService', () => {
  let service: BookmarkService;
  const mockBookmarkRepo = {
    findAll: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: 'BookmarkRepository',
          useValue: mockBookmarkRepo,
        },
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
