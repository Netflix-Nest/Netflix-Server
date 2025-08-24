import { PartialType } from "@nestjs/mapped-types";
import { CreateContentDto } from "@netflix-clone/types";

export class UpdateContentDto extends PartialType(CreateContentDto) {
  id: number;
}
