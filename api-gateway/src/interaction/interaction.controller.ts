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
import { CreateInteractionDto, RateDto } from "@netflix-clone/types";
import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { Public } from "@netflix-clone/common";

@Controller("interaction")
export class InteractionController {
  constructor(
    @Inject("INTERACTION_SERVICE")
    private readonly interactionClient: ClientProxy
  ) {}
  @Public()
  @Get("health")
  health() {
    return lastValueFrom(this.interactionClient.send("health", {}));
  }

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
