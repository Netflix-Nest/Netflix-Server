import { PartialType } from "@nestjs/mapped-types";
import {
  CreateEngagementDto,
  CreateWatchlistDto,
} from "./create-engagement.dto";

export class UpdateEngagementDto extends PartialType(CreateEngagementDto) {}
export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  id: number;
}
