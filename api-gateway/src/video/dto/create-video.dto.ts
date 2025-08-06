import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateVideoDto {
  @IsNotEmpty()
  @IsNumber()
  uploader: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  contentId: number;

  @IsNotEmpty()
  episodeNumber: number;

  @IsNotEmpty()
  seasonNumber: number;

  @IsOptional()
  status: string;

  @IsOptional()
  originalUrl: string;

  @IsOptional()
  hlsUrl: string;

  @IsNotEmpty()
  fileName: string;

  @IsOptional()
  duration: number;
}
