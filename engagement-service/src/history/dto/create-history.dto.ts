import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddHistoryDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  contentId: number;

  @IsNotEmpty()
  watchedAt: Date;

  @IsNotEmpty()
  duration: number;

  @IsOptional()
  deviceInfo: string;
}
