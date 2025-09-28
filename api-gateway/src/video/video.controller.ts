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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CreateVideoDto } from "@netflix-clone/types";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "src/common/decorators/customize";
import { IUserDecorator } from "src/interfaces/auth.interfaces";
import { lastValueFrom } from "rxjs";
import { Public } from "@netflix-clone/common";

@Controller("video")
export class VideoController {
  constructor(
    @Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy,
    @Inject("STORAGE_SERVICE") private readonly storageClient: ClientProxy,
    @Inject("JOB_SERVICE") private readonly jobClient: ClientProxy
  ) {}

  @Public()
  @Get("health")
  health() {
    return lastValueFrom(this.videoClient.send("health", {}));
  }

  @Post()
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @User() user: IUserDecorator
  ) {
    if (!createVideoDto.uploader) {
      createVideoDto.uploader = user.userId;
    }
    if (createVideoDto.fileName) {
      const originalUrl = await lastValueFrom(
        this.storageClient.send("get-video-url", {
          fileName: createVideoDto.fileName,
          bucket: "video-bucket",
        })
      );

      const hlsUrl = await lastValueFrom(
        this.storageClient.send("get-hls-url", createVideoDto.fileName)
      );
      createVideoDto.originalUrl = originalUrl;
      createVideoDto.hlsUrl = hlsUrl;
    }

    return lastValueFrom(this.videoClient.send("create-video", createVideoDto));
  }

  @Get()
  findAll(
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

  @Post("by-ids")
  findByIds(@Body() { ids }: { ids: number[] }) {
    return this.videoClient.send("find-by-ids", ids);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return lastValueFrom(this.videoClient.send("find-video", id));
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateVideoDto: UpdateVideoDto) {
    return lastValueFrom(
      this.videoClient.send("update-video", { id, updateVideoDto })
    );
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return lastValueFrom(this.videoClient.send("delete-video", id));
  }
}
