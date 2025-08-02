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
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("tag")
export class TagController {
	constructor(
		@Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy
	) {}

	@Post()
	create(@Body() createTagDto: CreateTagDto) {
		return lastValueFrom(this.videoClient.send("create-tag", createTagDto));
	}

	@Get()
	findAll(
		@Query("current") currentPage: number,
		@Query("pageSize") limit: number,
		@Query("qs") qs: string
	) {
		return lastValueFrom(
			this.videoClient.send("find-all-tag", { currentPage, limit, qs })
		);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("find-one-tag", +id));
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateTagDto: UpdateTagDto) {
		return lastValueFrom(
			this.videoClient.send("update-tag", { updateTagDto, id: +id })
		);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("remove-tag", +id));
	}
}
