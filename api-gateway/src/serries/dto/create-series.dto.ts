import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSeriesDto {
	@IsNotEmpty()
	@IsNumber()
	seasonNumber: number;

	@IsNotEmpty()
	@IsNumber()
	contentId: number;
}
