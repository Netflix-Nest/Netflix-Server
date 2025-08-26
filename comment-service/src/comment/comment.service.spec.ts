import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('CommentService', () => {
  let service: CommentService;
  const mockCommentModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: 'USER_SERVICE',
          useValue: {},
        },
        {
          provide: getModelToken('Comment'),
          useValue: mockCommentModel,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test') },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
