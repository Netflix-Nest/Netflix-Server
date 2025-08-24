import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from '@netflix-clone/types';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
