import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern('create-content')
  create(@Payload() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @MessagePattern('find-all-content')
  findAll(@Payload() data: { currentPage: number; limit: number; qs: string }) {
    const { currentPage, limit, qs } = data;
    return this.contentService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-one-content')
  findOne(@Payload() id: number) {
    return this.contentService.findOne(id);
  }

  @MessagePattern('update-content')
  update(@Payload() updateContentDto: UpdateContentDto) {
    return this.contentService.update(updateContentDto.id, updateContentDto);
  }

  @EventPattern('increase-view')
  increaseView(@Payload() id: number) {
    return this.contentService.increaseView(id);
  }

  @MessagePattern('remove-content')
  remove(@Payload() id: number) {
    return this.contentService.remove(id);
  }
}
