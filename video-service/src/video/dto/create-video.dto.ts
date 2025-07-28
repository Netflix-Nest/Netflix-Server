import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { VideoStatus } from '../entities/video.entity';

export class CreateVideoDto {
  @IsNotEmpty()
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

  @IsEmpty()
  fileName: string;

  @IsOptional()
  thumbnailUrl: string;

  @IsOptional()
  duration: number;
}
