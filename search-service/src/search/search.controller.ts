import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import {
  BulkIndexMoviesDto,
  IndexMovieDto,
  SearchMoviesDto,
  SuggestDto,
  UpdateMovieDto,
} from './dto/search.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @MessagePattern('health')
  health() {
    return this.service.health();
  }

  @MessagePattern('index-ensure')
  ensureIndex() {
    return this.service.ensureIndex();
  }

  @MessagePattern('index-delete')
  deleteIndex() {
    return this.service.deleteIndex();
  }

  @MessagePattern('add-movies')
  indexMovie(@Payload() dto: IndexMovieDto) {
    return this.service.indexMovie(dto);
  }

  @MessagePattern('add-bulk-movies')
  bulk(@Payload() dto: BulkIndexMoviesDto) {
    return this.service.bulkIndexMovies(dto);
  }

  @MessagePattern('update-movies')
  update(@Payload() { id, dto }: { id: string; dto: UpdateMovieDto }) {
    return this.service.updateMovie(id, dto);
  }

  @MessagePattern('delete-movies')
  remove(@Payload() id: string) {
    return this.service.deleteMovie(id);
  }

  // Reindex (admin) – pass full dataset from DB via body or call service internally
  @MessagePattern('reindex')
  async reindex(@Payload() dto: BulkIndexMoviesDto) {
    return this.service.reindex(dto.movies);
  }

  @MessagePattern('movies')
  search(@Payload() q: SearchMoviesDto) {
    return this.service.searchMovies(q);
  }

  @MessagePattern('suggest')
  suggest(@Payload() q: SuggestDto) {
    return this.service.suggest(q);
  }
}
