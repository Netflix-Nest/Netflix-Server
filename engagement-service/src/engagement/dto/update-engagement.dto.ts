import { PartialType } from '@nestjs/mapped-types';
import {
  CreateEngagementDto,
  CreateWatchlistDto,
} from './create-engagement.dto';

export class UpdateEngagementDto extends PartialType(CreateEngagementDto) {
  id: number;
}

export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  id: number;
}
