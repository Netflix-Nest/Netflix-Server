import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
	@IsOptional()
	userId?: number;

	@IsNotEmpty()
	content: string;

	@IsNotEmpty()
	contentId: number;

	@IsOptional()
	parentId?: string;
}
