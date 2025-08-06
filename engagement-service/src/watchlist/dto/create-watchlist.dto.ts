import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWatchlistDto {
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  contentIds: number[];

  @IsNotEmpty()
  name: string;

  @IsOptional()
  thumbnailUrl: string;
}
