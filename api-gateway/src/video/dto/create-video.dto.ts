import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum VideoStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export class CreateVideoDto {
  @IsOptional()
  @IsNumber()
  uploader: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  genreId: number;

  @IsOptional()
  status: VideoStatus;

  @IsOptional()
  originalUrl: string;

  @IsOptional()
  hlsUrl: string;

  @IsOptional()
  thumbnailUrl: string;

  @IsOptional()
  duration: number;
}
