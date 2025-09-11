import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ContentService } from './content.service';
import {
  CreateContentDto,
  QueryContentExcludeIdsFilter,
} from '@netflix-clone/types';
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

  @MessagePattern('find-content-by-genres')
  findByGenres(
    @Payload()
    {
      favoriteGenreIds,
      page,
      limit,
      excludeIds,
    }: {
      favoriteGenreIds: number[];
      page: number;
      limit: number;
      excludeIds: number[];
    },
  ) {
    return this.contentService.findContentByGenres(
      favoriteGenreIds,
      page,
      limit,
      excludeIds,
    );
  }

  @MessagePattern('find-all-exclude-ids')
  findExcludeIds(@Payload() data: QueryContentExcludeIdsFilter) {
    console.log(data);
    const { ids, currentPage, limit, additionalFilters, sortField, sortOrder } =
      data;
    return this.contentService.findAllExcludingIds(
      ids,
      currentPage,
      limit,
      additionalFilters,
      sortField,
      sortOrder,
    );
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
