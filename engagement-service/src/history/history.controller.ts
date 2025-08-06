import { Controller } from '@nestjs/common';
import { HistoryService } from './history.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddHistoryDto } from './dto/create-history.dto';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  @MessagePattern('get-history')
  async getHistory(@Payload() userId: number) {
    return this.historyService.getHistory(userId);
  }

  @MessagePattern('add-history')
  async addHistory(@Payload() addHistoryDto: AddHistoryDto) {
    return this.historyService.addHistory(addHistoryDto);
  }
}
