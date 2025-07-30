import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateSeriesDto {
  @IsNotEmpty()
  @IsNumber()
  seasonNumber: number;

  @IsNotEmpty()
  @IsNumber()
  contentId: number;
}
