import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateSeriesDto {
	@IsNotEmpty()
	@IsNumber()
	seasonNumber: number;

	@IsNotEmpty()
	@IsNumber()
	contentId: number;

	@IsOptional()
	totalEpisodes: number;

	@IsOptional()
	totalSeasonNumber: number;
}
