import { PartialType } from "@nestjs/mapped-types";
import { CreateCommentDto } from "./create-comment.dto";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateCommentDto {
	@IsOptional()
	userId?: number;

	@IsNotEmpty()
	content: string;
}
