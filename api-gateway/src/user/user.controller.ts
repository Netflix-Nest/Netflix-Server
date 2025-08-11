import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "src/common/decorators/customize";
import { lastValueFrom } from "rxjs";

@Controller("user")
export class UserController {
	constructor(
		@Inject("USER_SERVICE") private readonly userClient: ClientProxy
	) {}

	@Public()
	@Post("register")
	async register(@Body() createUserDto: CreateUserDto) {
		return lastValueFrom(
			this.userClient.send("register-user", createUserDto)
		);
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
			this.userClient.send("find-users", { currentPage, limit, qs })
		);
	}

	@Get(":id")
	async findOne(@Param("id") id: number) {
		return lastValueFrom(this.userClient.send("find-user", id));
	}

	@Patch(":id")
	async update(
		@Param("id") id: number,
		@Body() updateUserDto: UpdateUserDto
	) {
		console.log(updateUserDto);
		return lastValueFrom(
			this.userClient.send("update-user", { id, updateUserDto })
		);
	}

	@Delete(":id")
	async delete(@Param("id") id: number) {
		return lastValueFrom(this.userClient.send("delete-user", id));
	}
}
