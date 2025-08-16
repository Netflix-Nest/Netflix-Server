import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import {
  BulkIndexMoviesDto,
  IndexMovieDto,
  SearchMoviesDto,
  SuggestDto,
  UpdateMovieDto,
} from './dto/search.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

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
    const cleaned = JSON.parse(JSON.stringify(dto));
    return this.service.indexMovie(cleaned);
  }

  @EventPattern('movies.added')
  indexMovieSubscribe(@Payload() dto: IndexMovieDto) {
    const cleaned = JSON.parse(JSON.stringify(dto));
    return this.service.indexMovie(cleaned);
  }

  @MessagePattern('add-bulk-movies')
  bulk(@Payload() dto: BulkIndexMoviesDto) {
    return this.service.bulkIndexMovies(dto);
  }

  @MessagePattern('update-movies')
  update(@Payload() { id, dto }: { id: string; dto: UpdateMovieDto }) {
    const cleaned = JSON.parse(JSON.stringify(dto));
    return this.service.updateMovie(id, cleaned);
  }

  @MessagePattern('movies.updated')
  updateSubscribe(@Payload() { id, dto }: { id: string; dto: UpdateMovieDto }) {
    const cleaned = JSON.parse(JSON.stringify(dto));
    console.log(id, dto);
    return this.service.updateMovie(id, cleaned);
  }

  @MessagePattern('delete-movies')
  remove(@Payload() id: string) {
    return this.service.deleteMovie(id);
  }

  // Reindex (admin) – pass full dataset from DB via body or call service internally
  @MessagePattern('reindex')
  async reindex(@Payload() dto: BulkIndexMoviesDto) {
    const cleaned = JSON.parse(JSON.stringify(dto.movies));
    return this.service.reindex(cleaned);
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
