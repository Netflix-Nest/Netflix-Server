import { PartialType } from "@nestjs/mapped-types";
import { CreateVideoDto } from "@netflix-clone/types";

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
