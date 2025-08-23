import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';
import { Actor } from 'src/actor/entities/actor.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Series } from 'src/series/entities/series.entity';
import { Video } from 'src/video/entities/video.entity';
import { validateEntitiesOrThrow } from 'src/utils/validate.factory';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    @Inject('SEARCH_SERVICE') private readonly searchClient: ClientProxy,
  ) {}
  async validate(createContentDto: CreateContentDto | UpdateContentDto) {
    const {
      ageRating,
      totalScoreRating,
      followers,
      genreIds = [],
      quality,
      ratingCount,
      season,
      studio,
      tagIds = [],
      title,
      type,
      view,
      year,
      actorIds = [],
      country,
      description,
      director,
      seriesId,
      thumbnail,
      trailerId,
      videoId,
    } = createContentDto;
    const actors = await validateEntitiesOrThrow(
      actorIds,
      this.actorRepository,
      'Actor',
    );
    const genres = await validateEntitiesOrThrow(
      genreIds,
      this.genreRepository,
      'Genre',
    );
    const tags = await validateEntitiesOrThrow(
      tagIds,
      this.tagRepository,
      'Tag',
    );
    const series = seriesId
      ? ((await this.seriesRepository.findOne({ where: { id: seriesId } })) ??
        undefined)
      : undefined;

    if (seriesId && !series) {
      throw new RpcException('Invalid seriesId');
    }

    const video = videoId
      ? ((await this.videoRepository.findOne({ where: { id: videoId } })) ??
        undefined)
      : undefined;

    if (videoId && !video) {
      throw new RpcException('Invalid videoId');
    }
    const trailer = trailerId
      ? ((await this.videoRepository.findOne({ where: { id: trailerId } })) ??
        undefined)
      : undefined;

    if (trailerId && !trailer) {
      throw new RpcException('Invalid trailerId');
    }
    return { actors, genres, tags, series, video, trailer };
  }
  async create(createContentDto: CreateContentDto) {
    const {
      ageRating,
      totalScoreRating,
      followers,
      genreIds = [],
      quality,
      ratingCount,
      season,
      studio,
      tagIds = [],
      title,
      type,
      view,
      year,
      actorIds = [],
      country,
      description,
      director,
      seriesId,
      thumbnail,
      trailerId,
      videoId,
    } = createContentDto;
    const existContent = await this.contentRepository.findOne({
      where: { title: title },
    });
    if (existContent) {
      throw new RpcException('Content already exist !');
    }
    const { actors, genres, tags, series, video, trailer } =
      await this.validate(createContentDto);
    const content = this.contentRepository.create();
    Object.assign(content, {
      ageRating,
      totalScoreRating,
      followers,
      genres,
      quality,
      ratingCount,
      season,
      studio,
      tags,
      title,
      type,
      view,
      year,
      actors,
      country,
      description,
      director,
      series,
      thumbnail,
      trailer,
      video,
    });
    await this.contentRepository.save(content);
    this.searchClient.emit('movies.added', content);
    return content;
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
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
      relations: ['genres', 'tags', 'series', 'actors'],
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
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: {
        genres: true,
        tags: true,
        actors: true,
        series: true,
        video: true,
        trailer: true,
      },
    });
    return this.contentRepository.findOne({
      where: { id },
      relations: ['genres', 'tags', 'series', 'actors'],
    });
  }

  async findContentByGenres(favoriteGenreIds: number[], page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const query = this.contentRepository
      .createQueryBuilder('contents')
      .leftJoin('contents.genres', 'genres')
      .where('genres.id IN (:...ids)', { ids: favoriteGenreIds })
      .groupBy('contents.id')
      .addSelect('COUNT(genres.id)', 'matchcount')
      .orderBy('matchcount', 'DESC')
      .skip(offset)
      .take(limit);

    const { entities, raw } = await query.getRawAndEntities();

    const totalItems = await this.contentRepository
      .createQueryBuilder('contents')
      .leftJoin('contents.genres', 'genres')
      .where('genres.id IN (:...ids)', { ids: favoriteGenreIds })
      .getCount();

    const contents = entities.map((entity, idx) => ({
      ...entity,
      matchCount: Number(raw[idx].matchcount),
    }));

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
      data: contents,
    };
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new RpcException('Content not found !');
    }
    if (!updateContentDto.actorIds && content.actors) {
      updateContentDto.actorIds = content.actors?.map(
        (id) => id as unknown as number,
      );
    }
    if (!updateContentDto.genreIds && content.genres) {
      updateContentDto.genreIds = content.genres.map(
        (id) => id as unknown as number,
      );
    }
    if (!updateContentDto.tagIds && content.tags) {
      updateContentDto.tagIds = content.tags.map(
        (id) => id as unknown as number,
      );
    }
    if (!updateContentDto.videoId) {
      updateContentDto.videoId = content.video as unknown as number;
    }
    if (!updateContentDto.seriesId) {
      updateContentDto.seriesId = content.series as unknown as number;
    }
    if (!updateContentDto.trailerId) {
      updateContentDto.trailerId = content.trailer as unknown as number;
    }
    const { actors, genres, tags, series, video, trailer } =
      await this.validate(updateContentDto);

    if (updateContentDto.publishAt) {
      const contentDto = {
        title: updateContentDto.title ?? content.title,
        thumbnail: updateContentDto.thumbnail ?? content.thumbnail,
        publishAt: updateContentDto.publishAt,
        quality: updateContentDto.quality ?? content.quality,
      };
      this.notificationClient.emit('content-publish', {
        followers: content.followers,
        content: contentDto,
      });
    }
    const newContent = {
      id: content.id,
      title: updateContentDto.title ?? content.title,
      description: updateContentDto.description ?? content.description,
      thumbnail: updateContentDto.thumbnail ?? content.thumbnail,
      country: updateContentDto.country ?? content.country,
      director: updateContentDto.director ?? content.director,
      type: updateContentDto.type ?? content.type,
      year: updateContentDto.year ?? content.year,
      view: updateContentDto.view ?? content.view,
      followers: updateContentDto.followers ?? content.followers,
      quality: updateContentDto.quality ?? content.quality,
      totalScoreRating:
        updateContentDto.totalScoreRating ?? content.totalScoreRating,
      ratingCount: updateContentDto.ratingCount ?? content.ratingCount,
      studio: updateContentDto.studio ?? content.studio,
      season: updateContentDto.season ?? content.season,
      ageRating: updateContentDto.ageRating ?? content.ageRating,
      publishAt: updateContentDto.publishAt ?? content.publishAt,
      actors,
      genres,
      tags,
      series,
      video,
      trailer,
    };
    // use .save instead .update() to let typeORM resolve relation.
    await this.contentRepository.save(newContent);
    this.searchClient.emit('movies.updated', {
      id: String(content.id),
      dto: content,
    });
    return this.contentRepository.findOne({
      where: { id },
      relations: ['genres', 'tags', 'series', 'actors'],
    });
  }

  async increaseView(id: number) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new RpcException('Content not found !');
    }
    return this.contentRepository
      .createQueryBuilder()
      .update(Content)
      .set({ view: () => 'view + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new RpcException('Content not found !');
    }
    return this.contentRepository.softDelete(id);
  }
}
