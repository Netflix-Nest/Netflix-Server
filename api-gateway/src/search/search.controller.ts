import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import {
  BulkIndexMoviesDto,
  IndexMovieDto,
  SearchMoviesDto,
  SuggestDto,
  UpdateMovieDto,
} from "@netflix-clone/types";
import { CacheInterceptor } from "src/common/interceptors/cache.interceptor";

@Controller("search")
export class SearchController {
  constructor(
    @Inject("SEARCH_SERVICE") private readonly searchClient: ClientProxy
  ) {}
  @Get("health")
  health() {
    return lastValueFrom(this.searchClient.send("health", {}));
  }

  @Post("index-ensure")
  indexEnsure() {
    return lastValueFrom(this.searchClient.send("index-ensure", {}));
  }

  @Delete("index-delete")
  indexDelete() {
    return lastValueFrom(this.searchClient.send("index-delete", {}));
  }

  @Post("movies")
  addMovies(@Body() indexMovieDto: IndexMovieDto) {
    return lastValueFrom(this.searchClient.send("add-movies", indexMovieDto));
  }

  @Post("bulk-movies")
  addBulkMovies(@Body() bulkIndexMovieDto: BulkIndexMoviesDto) {
    return lastValueFrom(
      this.searchClient.send("add-movies", bulkIndexMovieDto)
    );
  }

  @Put("update-movies")
  updateMovie(
    @Body()
    { id, updateMovieDto }: { id: string; updateMovieDto: UpdateMovieDto }
  ) {
    return lastValueFrom(
      this.searchClient.send("update-movies", { id, updateMovieDto })
    );
  }

  @Delete("delete-movies/:id")
  deleteMovie(@Param("id") id: string) {
    return this.searchClient.send("delete-movies", id);
  }

  @Post("reindex")
  reindex(@Body() bulkIndexMoviesDto: BulkIndexMoviesDto) {
    // Clean undefined fields
    const cleanBulkMovie = JSON.parse(JSON.stringify(bulkIndexMoviesDto));
    return lastValueFrom(this.searchClient.send("reindex", cleanBulkMovie));
  }

  @Get("movies")
  @UseInterceptors(CacheInterceptor)
  search(@Body() q: SearchMoviesDto) {
    return lastValueFrom(this.searchClient.send("movies", q));
  }

  @Get("suggest")
  suggest(@Body() q: SuggestDto) {
    return lastValueFrom(this.searchClient.send("suggest", q));
  }
}
