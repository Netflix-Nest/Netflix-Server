import { PartialType } from "@nestjs/mapped-types";
import { CreateWatchlistDto } from "@netflix-clone/types";

export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  id: number;
}
