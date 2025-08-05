import { PartialType } from '@nestjs/mapped-types';
import { CreateEngagementDto } from './create-engagement.dto';

export class UpdateEngagementDto extends PartialType(CreateEngagementDto) {
  id: number;
}
