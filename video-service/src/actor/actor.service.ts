import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateActorDto } from '@netflix-clone/types';
import { UpdateActorDto } from './dto/update-actor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';
import { Content } from 'src/content/entities/content.entity';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService,
  ) {}
  async create(createActorDto: CreateActorDto) {
    const existActor = await this.actorRepository.findOne({
      where: {
        fullName: createActorDto.fullName,
        birthDate: createActorDto.birthDate,
      },
    });
    if (existActor) {
      throw new RpcException('Actor already exist !');
    }

    const existContents = await Promise.all(
      createActorDto.contentIds?.map(async (ctnId) => {
        const content = await this.contentService.findOne(ctnId);
        return content ? ctnId : null;
      }) ?? [],
    );
    const validContents = existContents.filter(
      (id): id is number => id !== null,
    );

    const contentEntities = validContents.map((id) => ({ id })) as Content[];

    const actor = this.actorRepository.create({
      ...createActorDto,
      contents: contentEntities,
    });

    await this.actorRepository.save(actor);
    return actor;
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
    const { filter, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = await this.actorRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const videos = await this.actorRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort || { createdAt: 'DESC' },
      select:
        projection && Object.keys(projection).length > 0
          ? (Object.keys(projection) as (keyof Actor)[])
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
    return this.actorRepository.findOne({
      where: { id },
      relations: ['contents'],
    });
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    const actor = await this.actorRepository.findOne({ where: { id } });
    if (!actor) {
      throw new RpcException('Actor not found !');
    }
    await this.actorRepository.update({ id }, { ...updateActorDto });
    return this.actorRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const actor = await this.actorRepository.findOne({ where: { id } });
    if (!actor) {
      throw new RpcException('Actor not found !');
    }
    await this.actorRepository.softDelete(id);
  }
}
