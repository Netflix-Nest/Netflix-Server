import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IndexMovieDto {
  @IsInt() id: number;
  @IsString() title: string;
  @IsString() slug: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsOptional() @IsArray() @Type(() => String) genres?: string[];
  @IsOptional() @IsArray() @Type(() => String) tags?: string[];
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() director?: string;
  @IsOptional() @IsIn(['single', 'series']) type?: 'single' | 'series';
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsInt() view?: number;
  @IsOptional() @IsArray() @Type(() => Number) followers?: number[];
  @IsOptional() @IsDateString() publishAt?: string;
  @IsOptional() @IsString() quality?: string;
  @IsOptional() @IsNumber() totalScoreRating?: number;
  @IsOptional() @IsInt() ratingCount?: number;
  @IsOptional() @IsInt() likeCount?: number;
  @IsOptional() @IsString() studio?: string;
  @IsOptional() @IsString() season?: string;
  @IsOptional() @IsString() trailer?: string;
  @IsOptional() @IsInt() ageRating?: number;

  @IsOptional() @IsDateString() createdAt?: string;
  @IsOptional() @IsDateString() updatedAt?: string;
  @IsOptional() @IsDateString() deletedAt?: string;
}

export class BulkIndexMoviesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndexMovieDto)
  movies: IndexMovieDto[];
}

export class UpdateMovieDto extends IndexMovieDto {}

export class SearchMoviesDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsArray() @Type(() => String) genres?: string[];
  @IsOptional() @IsArray() @Type(() => String) tags?: string[];
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsInt() yearFrom?: number;
  @IsOptional() @IsInt() yearTo?: number;
  @IsOptional() @IsNumber() ratingFrom?: number;
  @IsOptional() @IsNumber() ratingTo?: number;
  @IsOptional() @IsIn(['single', 'series']) type?: 'single' | 'series';

  @IsOptional()
  @IsIn(['relevance', 'view', 'rating', 'newest', 'year'])
  sort?: 'relevance' | 'view' | 'rating' | 'newest' | 'year' = 'relevance';

  @IsOptional() @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @IsInt() @Min(1) @Max(100) pageSize?: number = 20;
}

export class SuggestDto {
  @IsString() prefix: string;
  @IsOptional() @IsInt() @Min(1) @Max(10) size?: number = 5;
}
