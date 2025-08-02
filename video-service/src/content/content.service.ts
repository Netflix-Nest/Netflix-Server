import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';
import { ActorService } from 'src/actor/actor.service';
import { GenreService } from 'src/genre/genre.service';
import { TagService } from 'src/tag/tag.service';
import { SeriesService } from 'src/series/series.service';
import { VideoService } from 'src/video/video.service';
import { filterExistingIds } from 'src/utils/filter.exist';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @Inject(forwardRef(() => ActorService))
    private readonly actorService: ActorService,
    @Inject(forwardRef(() => GenreService))
    private readonly genreService: GenreService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    @Inject(forwardRef(() => SeriesService))
    private readonly seriesService: SeriesService,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
  ) {}
  async validIds(createContentDto: CreateContentDto | UpdateContentDto) {
    const {
      ageRating,
      averageRating,
      followers,
      genreIds,
      quality,
      ratingCount,
      season,
      studio,
      tagIds,
      title,
      type,
      view,
      year,
      actorIds,
      country,
      description,
      director,
      seriesId,
      thumbnail,
      trailerId,
      videoId,
    } = createContentDto;
    let obj: { actors?: number[]; genres?: number[]; tags?: number[] } = {};
    //actor
    if (actorIds) {
      const actors = await filterExistingIds(actorIds, (id) =>
        this.actorService.findOne(id),
      );
      obj.actors = actors;
    }

    //genre
    if (genreIds) {
      const genres = await filterExistingIds(genreIds, (id) =>
        this.genreService.findOne(id),
      );
      obj.genres = genres;
    }

    //tag
    if (tagIds) {
      const tags = await filterExistingIds(tagIds, (id) =>
        this.tagService.findOne(id),
      );
      obj.tags = tags;
    }

    //series
    if (seriesId) {
      const existSeries = await this.seriesService.findOne(seriesId);
      if (!existSeries || type !== 'series') {
        throw new RpcException(
          'Series does not exist or type of content must be series',
        );
      }
    }
    //video
    if (videoId) {
      const existVideo = await this.videoService.findOne(videoId);
      if (!existVideo || type !== 'single') {
        throw new RpcException(
          'Video does not exist or type of content must be video',
        );
      }
    }
    if (trailerId) {
      const existTrailer = await this.videoService.findOne(trailerId);
      if (!existTrailer) {
        throw new RpcException('Trailer does not exist !');
      }
    }
    return obj;
  }
  async create(createContentDto: CreateContentDto) {
    const {
      ageRating,
      averageRating,
      followers,
      genreIds,
      quality,
      ratingCount,
      season,
      studio,
      tagIds,
      title,
      type,
      view,
      year,
      actorIds,
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
    const {
      actors = [],
      genres = [],
      tags = [],
    } = await this.validIds(createContentDto);
    const content = this.contentRepository.create();
    Object.assign(content, {
      ageRating,
      averageRating,
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
      series: seriesId ? { id: seriesId } : undefined,
      thumbnail,
      trailer: trailerId ? { id: trailerId } : undefined,
      video: videoId ? { id: videoId } : undefined,
    });
    await this.contentRepository.save(content);
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
    const { actors, genres, tags } = await this.validIds(updateContentDto);
    if (actors) {
      updateContentDto.actorIds = actors;
    }
    if (genres) {
      updateContentDto.genreIds = genres;
    }

    if (tags) {
      updateContentDto.tagIds = tags;
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
