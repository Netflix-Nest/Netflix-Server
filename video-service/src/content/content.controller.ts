import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern('createContent')
  create(@Payload() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @MessagePattern('findAllContent')
  findAll() {
    return this.contentService.findAll();
  }

  @MessagePattern('findOneContent')
  findOne(@Payload() id: number) {
    return this.contentService.findOne(id);
  }

  @MessagePattern('updateContent')
  update(@Payload() updateContentDto: UpdateContentDto) {
    return this.contentService.update(updateContentDto.id, updateContentDto);
  }

  @MessagePattern('removeContent')
  remove(@Payload() id: number) {
    return this.contentService.remove(id);
  }
}
