import { Test, TestingModule } from '@nestjs/testing';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';

describe('MinioController', () => {
  let controller: MinioController;
  const mockJobClient = {
    send: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinioController],
      providers: [
        MinioService,
        {
          provide: 'JOB_SERVICE',
          useValue: mockJobClient,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test') },
        },
      ],
    }).compile();

    controller = module.get<MinioController>(MinioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
