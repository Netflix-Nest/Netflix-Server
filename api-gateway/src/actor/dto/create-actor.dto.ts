import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateActorDto {
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  birthDate?: Date;

  @IsOptional()
  nationality?: string;

  @IsOptional()
  biography?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  contentIds?: number[];
}
