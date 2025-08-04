import { Controller } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}
  @MessagePattern('like')
  async like() {
    return this.interactionService.like();
  }

  @MessagePattern('rate')
  async rate() {
    return this.interactionService.rate();
  }
}
