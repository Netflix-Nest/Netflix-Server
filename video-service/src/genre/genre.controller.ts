import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller()
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @MessagePattern('create-genre')
  create(@Payload() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @MessagePattern('find-all-genre')
  findAll(@Payload() data: { currentPage: number; limit: number; qs: string }) {
    const { currentPage, limit, qs } = data;
    return this.genreService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-one-genre')
  findOne(@Payload() id: number) {
    return this.genreService.findOne(id);
  }

  @MessagePattern('update-genre')
  update(@Payload() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(updateGenreDto.id, updateGenreDto);
  }

  @MessagePattern('remove-genre')
  remove(@Payload() id: number) {
    return this.genreService.remove(id);
  }
}
