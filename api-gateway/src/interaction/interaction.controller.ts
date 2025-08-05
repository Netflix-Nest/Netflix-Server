import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from "@nestjs/common";
import { CreateInteractionDto, RateDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

@Controller("interaction")
export class InteractionController {
  constructor(
    @Inject("INTERACTION_SERVICE")
    private readonly interactionClient: ClientProxy
  ) {}
  @Post("like/:contentId")
  async handleLike(@Param("contentId") contentId: number) {
    return lastValueFrom(this.interactionClient.send("like", contentId));
  }

  @Post("rate/:contentId")
  async handleRating(
    @Param("contentId") contentId: number,
    @Body() rateDto: RateDto
  ) {
    return lastValueFrom(
      this.interactionClient.send("rate", { contentId, rateDto })
    );
  }
}
