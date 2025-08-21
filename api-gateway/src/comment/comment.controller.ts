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
	UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { lastValueFrom } from "rxjs";
import { User } from "src/common/decorators/customize";
import { IUserDecorator } from "src/interfaces/auth.interfaces";
import { CacheInterceptor } from "src/common/interceptors/cache.interceptor";

@Controller("comment")
export class CommentController {
	constructor(
		@Inject("COMMENT_SERVICE") private readonly commentClient: ClientProxy
	) {}
	@Post()
	create(
		@Body() createCommentDto: CreateCommentDto,
		@User() user: IUserDecorator
	) {
		if (!createCommentDto.userId) createCommentDto.userId = user.userId;
		return lastValueFrom(
			this.commentClient.send("create-comment", createCommentDto)
		);
	}

	@Get()
	@UseInterceptors(CacheInterceptor)
	findAll(
		@Query("currentPage") currentPage: number,
		@Query("limit") limit: number,
		@Query("content") content: number
	) {
		return lastValueFrom(
			this.commentClient.send("get-comments", {
				currentPage,
				limit,
				content,
			})
		);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateCommentDto: UpdateCommentDto,
		@User() user: IUserDecorator
	) {
		if (!updateCommentDto.userId) updateCommentDto.userId = user.userId;
		return lastValueFrom(
			this.commentClient.send("update-comment", { id, updateCommentDto })
		);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return lastValueFrom(this.commentClient.send("delete-comment", id));
	}
}
