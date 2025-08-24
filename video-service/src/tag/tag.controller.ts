import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TagService } from './tag.service';
import { CreateTagDto } from '@netflix-clone/types';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('create-tag')
  create(@Payload() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @MessagePattern('find-all-tag')
  findAll(@Payload() data: { currentPage: number; limit: number; qs: string }) {
    const { currentPage, limit, qs } = data;
    return this.tagService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-one-tag')
  findOne(@Payload() id: number) {
    return this.tagService.findOne(id);
  }

  @MessagePattern('update-tag')
  update(@Payload() data: { id: number; updateTagDto: UpdateTagDto }) {
    const { id, updateTagDto } = data;
    return this.tagService.update(id, updateTagDto);
  }

  @MessagePattern('remove-tag')
  remove(@Payload() id: number) {
    return this.tagService.remove(id);
  }
}
