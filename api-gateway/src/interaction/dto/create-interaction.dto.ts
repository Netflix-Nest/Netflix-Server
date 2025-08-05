import { IsNotEmpty } from "class-validator";

export class CreateInteractionDto {}
export class RateDto {
  @IsNotEmpty()
  rate: number;
}
