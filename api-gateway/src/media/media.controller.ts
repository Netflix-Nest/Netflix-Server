import {
	Controller,
	Get,
	Inject,
	NotFoundException,
	Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Public, User } from "@netflix-clone/common";
import { Request, Response } from "express";
import { Client } from "minio";
import { lastValueFrom } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { IUserDecorator } from "@netflix-clone/types";
import { UpdateVideoDto } from "src/video/dto/update-video.dto";

@Controller("media")
export class MediaController {
	private readonly minioClient: Client;

	constructor(
		private readonly configService: ConfigService,
		@Inject("STORAGE_SERVICE") private readonly storageClient: ClientProxy
	) {
		this.minioClient = new Client({
			endPoint:
				this.configService.get<string>("SERVER_IP") ?? "localhost",
			port: 9000,
			useSSL: false,
			accessKey: this.configService.get<string>("MINIO_ACCESS_KEY"),
			secretKey: this.configService.get<string>("MINIO_SECRET_KEY"),
			pathStyle: true,
		});
	}

	@Post("upload-video")
	@UseInterceptors(FileInterceptor("file"))
	async upload(
		@UploadedFile() file: Express.Multer.File,
		@User() user: IUserDecorator
	) {
		// File: { buffer, mimetype, originalname, ... }
		// RMQ can't stay Buffer type, it turn buffer into object -> storage service receive a pain object
		// We have to transform it to string before
		const base64 = file.buffer.toString("base64");
		//upload video to minIO
		const { url, fileName } = await lastValueFrom(
			this.storageClient.send("upload-video", {
				originalname: file.originalname,
				base64,
				mimetype: file.mimetype,
			})
		);

		// //transcode video
		// this.jobClient.emit("video-transcode", { fileName, url });

		// const duration = await lastValueFrom(
		// 	this.jobClient.send("get-video-duration", url)
		// );

		return {
			uploader: user.userId,
			fileName,
			url: `${process.env.ORIGIN_URL_MEDIA}/media/videos/${fileName}`,
		};
	}

	@Post("upload-image")
	@UseInterceptors(FileInterceptor("file"))
	async uploadImage(
		@UploadedFile() file: Express.Multer.File,
		@User() user: IUserDecorator
	) {
		console.log("buffer: ", file);
		const base64 = file.buffer.toString("base64");
		const { url, fileName } = await lastValueFrom(
			this.storageClient.send("upload-image", {
				originalname: file.originalname,
				base64,
				mimetype: file.mimetype,
			})
		);
		return {
			uploader: user.userId,
			fileName,
			url: `${process.env.ORIGIN_URL_MEDIA}/media/images/${fileName}`,
		};
	}

	@Public()
	@Get("images/:fileName")
	async getImage(@Param("fileName") fileName: string, @Res() res: Response) {
		return this.streamFile(fileName, "image-bucket", res);
	}

	@Public()
	@Get("videos/:fileName")
	async getVideo(
		@Param("fileName") fileName: string,
		@Req() req: Request,
		@Res() res: Response
	) {
		return this.streamFile(fileName, "video-bucket", res, req);
	}

	private async streamFile(
		fileName: string,
		bucket: string,
		res: Response,
		req?: Request
	) {
		try {
			const fileInfo = await lastValueFrom(
				this.storageClient.send("verify-file-access", {
					fileName,
					bucket,
				})
			);

			if (!fileInfo.exists) {
				throw new NotFoundException("File not found");
			}

			const stat = await this.minioClient.statObject(bucket, fileName);
			const fileSize = stat.size;
			const contentType = stat.metaData["content-type"];

			if (req && req.headers.range && contentType?.startsWith("video/")) {
				return this.handleRangeRequest(
					req,
					res,
					bucket,
					fileName,
					fileSize,
					contentType
				);
			}

			// Normal streaming
			const stream = await this.minioClient.getObject(bucket, fileName);

			res.setHeader("Content-Type", contentType);
			res.setHeader("Content-Length", fileSize);
			res.setHeader("Accept-Ranges", "bytes");

			if (contentType?.startsWith("video/")) {
				res.setHeader("Cache-Control", "public, max-age=3600"); // cache video 1 hr
			} else {
				res.setHeader("Cache-Control", "public, max-age=86400"); // cache image 1 day
			}

			stream.pipe(res);
		} catch (error) {
			console.error("Error streaming file:", error);
			throw new NotFoundException("File not found");
		}
	}

	// Handle Range Request (for seek)
	private async handleRangeRequest(
		req: Request,
		res: Response,
		bucket: string,
		fileName: string,
		fileSize: number,
		contentType: string
	) {
		const range = req.headers.range ?? "";
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		const chunksize = end - start + 1;

		try {
			const stream = await this.minioClient.getPartialObject(
				bucket,
				fileName,
				start,
				chunksize
			);

			res.status(206); // Partial Content
			res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
			res.setHeader("Accept-Ranges", "bytes");
			res.setHeader("Content-Length", chunksize);
			res.setHeader("Content-Type", contentType);

			stream.pipe(res);
		} catch (error) {
			console.error("Error handling range request:", error);
			res.status(416).send("Range Not Satisfiable");
		}
	}
}
