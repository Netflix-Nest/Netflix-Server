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
import { CreateSeriesDto } from "./dto/create-series.dto";
import { UpdateSeriesDto } from "./dto/update-series.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("series")
export class SeriesController {
	constructor(
		@Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy
	) {}

	@Post()
	create(@Body() createSeriesDto: CreateSeriesDto) {
		return lastValueFrom(
			this.videoClient.send("create-series", createSeriesDto)
		);
	}

	@Get()
	findAll(
		@Query("current") currentPage: number,
		@Query("pageSize") limit: number,
		@Query("qs") qs: string
	) {
		return lastValueFrom(
			this.videoClient.send("find-all-series", { currentPage, limit, qs })
		);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("find-one-series", +id));
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
		return lastValueFrom(
			this.videoClient.send("update-series", {
				...updateSeriesDto,
				id: +id,
			})
		);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("remove-series", +id));
	}
}
