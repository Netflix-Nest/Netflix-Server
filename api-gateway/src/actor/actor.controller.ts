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
import { CreateActorDto } from "./dto/create-actor.dto";
import { UpdateActorDto } from "./dto/update-actor.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller("actor")
export class ActorController {
	constructor(
		@Inject("VIDEO_SERVICE") private readonly videoClient: ClientProxy
	) {}

	@Post()
	create(@Body() createActorDto: CreateActorDto) {
		return lastValueFrom(
			this.videoClient.send("create-actor", createActorDto)
		);
	}

	@Get()
	findAll(
		@Query("current") currentPage: number,
		@Query("pageSize") limit: number,
		@Query("qs") qs: string
	) {
		return lastValueFrom(
			this.videoClient.send("find-all-actor", { currentPage, limit, qs })
		);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("find-one-actor", +id));
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateActorDto: UpdateActorDto) {
		return lastValueFrom(
			this.videoClient.send("update-actor", {
				updateActorDto,
				id: +id,
			})
		);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return lastValueFrom(this.videoClient.send("remove-actor", +id));
	}
}
