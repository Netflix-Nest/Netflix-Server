import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import aqp from 'api-query-params';
import { RpcException } from '@nestjs/microservices';
import { Content } from 'src/content/entities/content.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createVideoDto: CreateVideoDto) {
    const existVideo = await this.videoRepository.findOne({
      where: { content: { id: createVideoDto.contentId } },
    });
    if (existVideo) {
      throw new RpcException('Video already exist !');
    }

    const content = await this.contentRepository.findOneBy({
      id: createVideoDto.contentId,
    });
    if (!content) {
      throw new RpcException('Content not found');
    }
    const video = await this.videoRepository.create({
      ...createVideoDto,
    });
    await this.videoRepository.save(video);
    return video;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.videoRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const videos = await this.videoRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof Video)[])
          : undefined,
      relations: ['content'],
    });

    return {
      meta: {
        currentPage: +currentPage,
        pageSize: defaultLimit,
        totalItems,
        totalPages,
      },
      data: videos,
    };
  }

  async findOne(id: number) {
    return this.videoRepository.findOne({
      where: { id },
      relations: ['content'],
    });
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) {
      throw new RpcException('Video Not Found !');
    }
    await this.videoRepository.update(id, updateVideoDto);
    return this.findOne(id);
  }

  async delete(id: number) {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) {
      throw new RpcException('Video Not Found !');
    }
    return this.videoRepository.softDelete(id);
  }
}
