import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from "@nestjs/common";
import { CreateGenreDto } from "@netflix-clone/types";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("genre")
export class GenreController {
  constructor(
    @Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return lastValueFrom(this.videoClient.send("create-genre", createGenreDto));
  }

  @Get()
  findAll(
    @Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query("qs") qs: string
  ) {
    return lastValueFrom(
      this.videoClient.send("find-all-genre", { currentPage, limit, qs })
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return lastValueFrom(this.videoClient.send("find-one-genre", +id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return lastValueFrom(
      this.videoClient.send("update-genre", {
        updateGenreDto,
        id: +id,
      })
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return lastValueFrom(this.videoClient.send("remove-genre", +id));
  }
}
