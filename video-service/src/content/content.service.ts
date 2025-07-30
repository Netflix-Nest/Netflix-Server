import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateActorDto } from 'src/actor/dto/create-actor.dto';
import aqp from 'api-query-params';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}
  async create(createContentDto: CreateContentDto) {
    const existContent = await this.contentRepository.findOne({
      where: { title: createContentDto.title },
    });
    if (existContent) {
      throw new RpcException('Content already exist !');
    }
    const content = await this.contentRepository.create({
      ...createContentDto,
    });
    await this.contentRepository.save(content);
    return content;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.contentRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const videos = await this.contentRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof Content)[])
          : undefined,
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
    return this.contentRepository.findOne({ where: { id } });
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new RpcException('Content not found !');
    }
    await this.contentRepository.update({ id }, { ...updateContentDto });
    return this.contentRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new RpcException('Content not found !');
    }
    return this.contentRepository.softDelete(id);
  }
}
