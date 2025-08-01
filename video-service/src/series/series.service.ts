import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';
import { Content } from 'src/content/entities/content.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}
  async create(createSeriesDto: CreateSeriesDto) {
    const { contentId, seasonNumber } = createSeriesDto;
    const existSeries = await this.seriesRepository.findOne({
      where: {
        content: { id: createSeriesDto.contentId },
        seasonNumber: seasonNumber,
      },
    });

    if (existSeries) {
      throw new RpcException('Series already exist !');
    }

    const content = await this.contentRepository.findOneBy({ id: contentId });
    if (!content) {
      throw new RpcException('Content not found');
    }

    const newSeries = this.seriesRepository.create({
      seasonNumber,
      content,
    });

    await this.seriesRepository.save(newSeries);
    return newSeries;
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.seriesRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const videos = await this.seriesRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof Series)[])
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
    return this.seriesRepository.findOne({
      where: { id },
      relations: ['content'],
    });
  }

  async update(id: number, updateSeriesDto: UpdateSeriesDto) {
    const existSeries = await this.seriesRepository.findOne({ where: { id } });
    if (!existSeries) {
      throw new RpcException('Series not found !');
    }
    await this.seriesRepository.update({ id }, { ...updateSeriesDto });
    return this.seriesRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const existSeries = await this.seriesRepository.findOne({
      where: { id },
    });
    if (!existSeries) {
      throw new RpcException('Series not found !');
    }
    return this.seriesRepository.softDelete(id);
  }
}
