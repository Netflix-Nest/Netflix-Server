import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from '@netflix-clone/types';
import { UpdateVideoDto } from './dto/update-video.dto';
import aqp from 'api-query-params';
import { RpcException } from '@nestjs/microservices';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService,
  ) {}

  async create(createVideoDto: CreateVideoDto) {
    const existVideo = await this.videoRepository.findOne({
      where: {
        seasonNumber: createVideoDto.seasonNumber,
        episodeNumber: createVideoDto.episodeNumber,
      },
    });
    if (existVideo) {
      throw new RpcException('Video already exist !');
    }

    const content = await this.contentService.findOne(createVideoDto.contentId);
    if (!content) {
      throw new RpcException('Content not found');
    }

    const video = this.videoRepository.create({
      ...createVideoDto,
      contents: content,
    });
    await this.videoRepository.save(video);
    return video;
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
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
      relations: ['contents'],
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
      relations: ['contents'],
    });
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) {
      throw new RpcException('Video Not Found !');
    }

    if (updateVideoDto.contentId) {
      const content = await this.contentService.findOne(
        updateVideoDto.contentId,
      );
      if (!content) {
        throw new RpcException('Content not found');
      }
      updateVideoDto.content = content;
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
