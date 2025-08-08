import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  content: string;
}
