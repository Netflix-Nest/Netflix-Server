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
  UseInterceptors,
} from "@nestjs/common";
import {
  CreateContentDto,
  QueryContentExcludeIdsFilter,
} from "@netflix-clone/types";
import { UpdateContentDto } from "./dto/update-content.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { CacheInterceptor } from "src/common/interceptors/cache.interceptor";

@Controller("content")
export class ContentController {
  constructor(
    @Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return lastValueFrom(
      this.videoClient.send("create-content", createContentDto)
    );
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll(
    @Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query("qs") qs: string
  ) {
    console.log(qs);
    return lastValueFrom(
      this.videoClient.send("find-all-content", {
        currentPage,
        limit,
        qs,
      })
    );
  }

  @Post("exclude")
  @UseInterceptors(CacheInterceptor)
  findAllExclude(
    @Body() data: QueryContentExcludeIdsFilter,
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string
  ) {
    data.currentPage = +currentPage;
    data.limit = +limit;
    return lastValueFrom(this.videoClient.send("find-all-exclude-ids", data));
  }

  @Post("by-ids")
  @UseInterceptors(CacheInterceptor)
  findByIds(
    @Body() { ids }: { ids: number[] },
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string
  ) {
    const data = {
      ids,
      currentPage,
      limit,
    };
    console.log("ids body: ", ids, "data: ", data);
    return lastValueFrom(this.videoClient.send("find-contents-by-ids", data));
  }

  @Get(":id")
  @UseInterceptors(CacheInterceptor)
  findOne(@Param("id") id: string) {
    return lastValueFrom(this.videoClient.send("find-one-content", +id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateContentDto: UpdateContentDto) {
    if (!updateContentDto.id) {
      updateContentDto.id = +id;
    }
    return lastValueFrom(
      this.videoClient.send("update-content", updateContentDto)
    );
  }

  @Post("increase-view/:id")
  increaseView(@Param("id") id: number) {
    this.videoClient.emit("increase-view", id);
    return "ok";
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return lastValueFrom(this.videoClient.send("remove-content", +id));
  }
}
