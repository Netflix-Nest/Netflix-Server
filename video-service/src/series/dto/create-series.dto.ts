import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsNull } from 'typeorm';

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
