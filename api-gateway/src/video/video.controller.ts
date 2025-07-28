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
import { CreateVideoDto, VideoStatus } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "src/common/decorators/customize";
import { IUserDecorator } from "src/interfaces/auth.interfaces";
import { lastValueFrom } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("video")
export class VideoController {
	constructor(
		@Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy,
		@Inject("STORAGE_SERVICE") private readonly storageClient: ClientProxy,
		@Inject("JOB_SERVICE") private readonly jobClient: ClientProxy
	) {}

	@Post()
	create(
		@Body() createVideoDto: CreateVideoDto,
		@User() user: IUserDecorator
	) {
		if (!createVideoDto.uploader) {
			createVideoDto.uploader = user.userId;
		}
		return lastValueFrom(
			this.videoClient.send("create-video", createVideoDto)
		);
	}

	@Post("upload")
	@UseInterceptors(FileInterceptor("file"))
	async upload(
		@UploadedFile() file: Express.Multer.File,
		@User() user: IUserDecorator
	) {
		// File: { buffer, mimetype, originalname, ... }
		// RMQ can't stay Buffer type, it turn buffer into object -> storage service receive a pain object
		// We have to transform it to string before
		const base64 = file.buffer.toString("base64");
		const { url, fileName } = await lastValueFrom(
			this.storageClient.send("upload-video", {
				originalname: file.originalname,
				base64,
				mimetype: file.mimetype,
			})
		);
		console.log("upload success !", url, fileName);
		const videoUrl = await lastValueFrom(
			this.storageClient.send("get-video-url", {
				bucket: "video-bucket",
				fileName,
			})
		);
		console.log("get url video success: ", videoUrl);

		const outputDir = `/app/outputs/${fileName}`;
		this.jobClient.emit("video-transcode", { fileName, url });

		const duration = await lastValueFrom(
			this.jobClient.send("get-video-duration", url)
		);

		const uploadVideoDto: UpdateVideoDto = {
			uploader: user.userId,
			originalUrl: videoUrl,
			hlsUrl: outputDir,
			duration,
		};
		return uploadVideoDto;
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
