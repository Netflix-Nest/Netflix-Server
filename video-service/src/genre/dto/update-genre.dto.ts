import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from '@netflix-clone/types';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}
