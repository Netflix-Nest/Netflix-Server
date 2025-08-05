import { Controller } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}
  @MessagePattern('like-video')
  async like(@Payload() contentId: number) {
    return this.interactionService.like(contentId);
  }

  @MessagePattern('rate-video')
  async rate(
    @Payload() { contentId, rate }: { contentId: number; rate: number },
  ) {
    return this.interactionService.rate(contentId, rate);
  }
}
