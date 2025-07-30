import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}
  async create(createGenreDto: CreateGenreDto) {
    const existGenre = await this.genreRepository.findOne({
      where: { name: createGenreDto.name },
    });
    if (existGenre) {
      throw new RpcException('Genre already exist !');
    }
    return existGenre;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.genreRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const videos = await this.genreRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof Genre)[])
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
    return this.genreRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const existGenre = await this.genreRepository.findOne({ where: { id } });
    if (!existGenre) {
      throw new RpcException('Genre not found !');
    }
    await this.genreRepository.update({ id }, { ...updateGenreDto });
    return this.genreRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const existGenre = await this.genreRepository.findOne({
      where: { id },
    });
    if (!existGenre) {
      throw new RpcException('Genre not found !');
    }
    return this.genreRepository.softDelete(id);
  }
}
