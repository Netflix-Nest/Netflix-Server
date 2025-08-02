import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly TagRepository: Repository<Tag>,
  ) {}
  async create(createTagDto: CreateTagDto) {
    const existTag = await this.TagRepository.findOne({
      where: { name: createTagDto.name },
    });
    if (existTag) {
      throw new RpcException('Tag already exist !');
    }
    const tag = this.TagRepository.create({ ...createTagDto });
    return this.TagRepository.save(tag);
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.TagRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const videos = await this.TagRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof Tag)[])
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
    return this.TagRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const existTag = await this.TagRepository.findOne({ where: { id } });
    if (!existTag) {
      throw new RpcException('Tag not found !');
    }
    await this.TagRepository.update({ id }, { ...updateTagDto });
    return this.TagRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const existTag = await this.TagRepository.findOne({
      where: { id },
    });
    if (!existTag) {
      throw new RpcException('Tag not found !');
    }
    return this.TagRepository.softDelete(id);
  }
}
