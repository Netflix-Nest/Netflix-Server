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
import { CreateContentDto } from "./dto/create-content.dto";
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
		return lastValueFrom(
			this.videoClient.send("find-all-content", {
				currentPage,
				limit,
				qs,
			})
		);
	}

	@Get(":id")
	@UseInterceptors(CacheInterceptor)
	findOne(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("find-one-content", +id));
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateContentDto: UpdateContentDto
	) {
		const newId = +id;
		return lastValueFrom(
			this.videoClient.send("update-content", {
				...updateContentDto,
				newId,
			})
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
