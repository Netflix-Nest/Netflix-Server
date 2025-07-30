import { Injectable } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';
import { RpcException } from '@nestjs/microservices';
import aqp from 'api-query-params';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
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
    const actor = this.actorRepository.create({
      ...createActorDto,
    });

    await this.actorRepository.save(actor);
    return actor;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
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
    return this.actorRepository.findOne({
      where: { id },
      relations: ['content'],
    });
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    const actor = await this.actorRepository.findOne({ where: { id } });
    if (!actor) {
      throw new RpcException('Actor not found !');
    }
    return this.actorRepository.update({ id }, { ...updateActorDto });
  }

  async remove(id: number) {
    const actor = await this.actorRepository.findOne({ where: { id } });
    if (!actor) {
      throw new RpcException('Actor not found !');
    }
    await this.actorRepository.softDelete(id);
  }
}
