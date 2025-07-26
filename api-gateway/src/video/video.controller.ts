import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "src/common/decorators/customize";
import { IUserDecorator } from "src/interfaces/auth.interfaces";
import { lastValueFrom } from "rxjs";

@Controller("video")
export class VideoController {
  constructor(
    @Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto, @User() user: IUserDecorator) {
    if (!createVideoDto.uploader) {
      createVideoDto.uploader = user.userId;
    }
    return lastValueFrom(this.videoClient.send("create-video", createVideoDto));
  }

  @Get()
  async findAll(
    @Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string
  ) {
    if (!currentPage) currentPage = 1;
    if (!limit) limit = 5;
    return lastValueFrom(
      this.videoClient.send("find-videos", { currentPage, limit, qs })
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return lastValueFrom(this.videoClient.send("find-video", id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return lastValueFrom(
      this.videoClient.send("update-video", { id, updateVideoDto })
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return lastValueFrom(this.videoClient.send("delete-video", id));
  }
}
