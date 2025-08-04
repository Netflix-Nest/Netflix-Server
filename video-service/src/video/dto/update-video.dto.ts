import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import { Content } from 'src/content/entities/content.entity';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  content?: Content;
}
