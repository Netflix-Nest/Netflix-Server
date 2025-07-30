import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Controller()
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @MessagePattern('create-actor')
  create(@Payload() createActorDto: CreateActorDto) {
    return this.actorService.create(createActorDto);
  }

  @MessagePattern('find-all-actor')
  findAll(@Payload() data: { currentPage: number; limit: number; qs: string }) {
    const { currentPage, limit, qs } = data;
    return this.actorService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-one-actor')
  findOne(@Payload() id: number) {
    return this.actorService.findOne(id);
  }

  @MessagePattern('update-actor')
  update(@Payload() updateActorDto: UpdateActorDto) {
    return this.actorService.update(updateActorDto.id, updateActorDto);
  }

  @MessagePattern('remove-actor')
  remove(@Payload() id: number) {
    return this.actorService.remove(id);
  }
}
