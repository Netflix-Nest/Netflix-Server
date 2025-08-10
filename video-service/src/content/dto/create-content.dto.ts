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

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsOptional()
  @IsInt()
  view: number = 0;

  @IsOptional()
  @IsInt()
  followers: number = 0;

  @IsOptional()
  publishAt: Date;

  @IsNotEmpty()
  @IsString()
  quality: string;

  @IsOptional()
  @IsNumber()
  totalScoreRating: number = 0;

  @IsOptional()
  @IsInt()
  ratingCount: number = 0;

  @IsNotEmpty()
  @IsString()
  studio: string;

  @IsNotEmpty()
  @IsString()
  season: string;

  @IsOptional()
  @IsInt()
  trailerId?: number;

  @IsNotEmpty()
  @IsInt()
  ageRating: number;
}
