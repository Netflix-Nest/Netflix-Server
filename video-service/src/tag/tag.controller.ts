import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('createTag')
  create(@Payload() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @MessagePattern('findAllTag')
  findAll() {
    return this.tagService.findAll();
  }

  @MessagePattern('findOneTag')
  findOne(@Payload() id: number) {
    return this.tagService.findOne(id);
  }

  @MessagePattern('updateTag')
  update(@Payload() updateTagDto: UpdateTagDto) {
    return this.tagService.update(updateTagDto.id, updateTagDto);
  }

  @MessagePattern('removeTag')
  remove(@Payload() id: number) {
    return this.tagService.remove(id);
  }
}
