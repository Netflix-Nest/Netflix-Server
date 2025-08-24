import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateGenreDto } from '@netflix-clone/types';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';
import { ContentService } from 'src/content/content.service';
import { Content } from 'src/content/entities/content.entity';
import { validateEntitiesOrThrow } from 'src/utils/validate.factory';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}
  async create(createGenreDto: CreateGenreDto) {
    const existGenre = await this.genreRepository.findOne({
      where: { name: createGenreDto.name },
    });
    if (existGenre) {
      throw new RpcException('Genre already exist !');
    }
    const contents = await validateEntitiesOrThrow(
      createGenreDto.contentIds ?? [],
      this.contentRepository,
      'Content',
    );
    const genre = this.genreRepository.create({
      ...createGenreDto,
      contents,
    });
    await this.genreRepository.save(genre);
    return genre;
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
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
    return this.genreRepository.findOne({
      where: { id },
      relations: ['contents'],
    });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const existGenre = await this.genreRepository.findOne({ where: { id } });
    if (!existGenre) {
      throw new RpcException('Genre not found !');
    }

    const updateData: Partial<Genre> = { ...updateGenreDto };
    if (updateGenreDto.contentIds !== undefined) {
      const contents = await validateEntitiesOrThrow(
        updateGenreDto.contentIds,
        this.contentRepository,
        'Content',
      );
      updateData.contents = contents;
    } else {
      delete updateData.contents;
    }

    await this.genreRepository.update({ id }, updateData);
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
