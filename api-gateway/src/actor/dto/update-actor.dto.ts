import { PartialType } from "@nestjs/mapped-types";
import { CreateActorDto } from "@netflix-clone/types";

export class UpdateActorDto extends PartialType(CreateActorDto) {
  id: number;
}
