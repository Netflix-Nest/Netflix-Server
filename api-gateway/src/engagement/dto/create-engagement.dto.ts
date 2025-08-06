import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEngagementDto {}
export class CreateBookmarkDto {
  userId?: number;

  @IsNotEmpty()
  contentId: number;

  @IsNotEmpty()
  timestamp: number;

  @IsOptional()
  note: string;
}

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
