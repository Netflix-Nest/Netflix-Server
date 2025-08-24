import { PartialType } from "@nestjs/mapped-types";
import { CreateInteractionDto } from "@netflix-clone/types";

export class UpdateInteractionDto extends PartialType(CreateInteractionDto) {}
