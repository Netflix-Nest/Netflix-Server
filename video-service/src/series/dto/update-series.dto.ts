import { PartialType } from '@nestjs/mapped-types';
import { CreateSeriesDto } from '@netflix-clone/types';

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {
  id: number;
}
