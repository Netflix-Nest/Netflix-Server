import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsArray()
  @IsInt({ each: true })
  genreIds: number[];

  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsEnum(['single', 'series'])
  type: 'single' | 'series';

  @IsOptional()
  @IsInt()
  videoId?: number;

  @IsOptional()
  @IsInt()
  seriesId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  actorIds?: number[];

  @IsInt()
  year: number;

  @IsOptional()
  @IsInt()
  view: number = 0;

  @IsOptional()
  @IsInt()
  followers: number = 0;

  @IsString()
  quality: string;

  @IsOptional()
  @IsNumber()
  averageRating: number = 0;

  @IsOptional()
  @IsInt()
  ratingCount: number = 0;

  @IsString()
  studio: string;

  @IsString()
  season: string;

  @IsOptional()
  @IsInt()
  trailerId?: number;

  @IsInt()
  ageRating: number;
}
