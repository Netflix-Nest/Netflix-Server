import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from '@netflix-clone/types';
import { Content } from 'src/content/entities/content.entity';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  content?: Content;
}
