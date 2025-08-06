import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}
  async getHistory(userId: number) {
    return this.historyRepository.find({
      where: { userId },
      order: { watchedAt: 'DESC' },
    });
  }

  async addHistory(addHistoryDto: AddHistoryDto) {
    const histories = await this.historyRepository.countBy({
      userId: addHistoryDto.userId,
    });
    if (histories > 30) {
      const oldestHistory = await this.historyRepository.findOne({
        where: { userId: addHistoryDto.userId },
        order: { watchedAt: 'DESC' },
      });
      await this.historyRepository.delete({ id: oldestHistory?.id });
    }
    const history = await this.historyRepository.findOne({
      where: {
        userId: addHistoryDto.userId,
        contentId: addHistoryDto.contentId,
      },
    });
    if (!history) {
      const newHistory = await this.historyRepository.create({
        ...addHistoryDto,
      });
      return this.historyRepository.save(newHistory);
    }
    if (history) {
      history.watchedAt = addHistoryDto.watchedAt;
      history.duration = addHistoryDto.duration;
      history.deviceInfo = addHistoryDto.deviceInfo;
    }

    return this.historyRepository.save(history);
  }
}
