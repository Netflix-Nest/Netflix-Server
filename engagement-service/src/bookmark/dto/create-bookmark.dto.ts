import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  contentId: number;

  @IsNotEmpty()
  timestamp: number;

  @IsOptional()
  note: string;
}
