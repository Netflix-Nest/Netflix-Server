import { Injectable } from '@nestjs/common';
import {
  AddHistoryDto,
  CreateBookmarkDto,
  CreateEngagementDto,
  CreateWatchlistDto,
} from './dto/create-engagement.dto';
import {
  UpdateEngagementDto,
  UpdateWatchlistDto,
} from './dto/update-engagement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Raw, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Bookmark } from './entities/bookmark.entity';
import { History } from './entities/history.entity';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}
  async createWatchlist(createWatchlistDto: CreateWatchlistDto) {
    const watchlist = await this.watchlistRepository.findOne({
      where: {
        userId: createWatchlistDto.userId,
        name: createWatchlistDto.name,
      },
    });
    if (watchlist) {
      throw new RpcException('Watchlist is already exist !');
    }
    const newWatchlist = this.watchlistRepository.create({
      ...createWatchlistDto,
    });
    return this.watchlistRepository.save(newWatchlist);
  }

  async updateWatchlist(updateWatchlistDto: UpdateWatchlistDto) {
    const watchlist = await this.watchlistRepository.findOne({
      where: { id: updateWatchlistDto.id },
    });
    if (!watchlist) {
      throw new RpcException('Watchlist not found !');
    }
    return this.watchlistRepository.update(
      { id: updateWatchlistDto.id },
      { ...updateWatchlistDto },
    );
  }

  async getAllWatchlist(userId: number) {
    return this.watchlistRepository.findOne({ where: { userId: userId } });
  }

  async getOneWatchlist(userId: number, watchlistId: number) {
    return this.watchlistRepository.findOne({
      where: { userId, id: watchlistId },
    });
  }

  async addVideoToWatchlist(contentId: number, watchlistId: number) {
    const watchlist = await this.watchlistRepository.findOne({
      where: {
        id: watchlistId,
        contentIds: Raw((alias) => `${alias} @> ARRAY[${contentId}]`),
      },
    });
    if (watchlist) {
      throw new RpcException('Video already exist in watchlist !');
    }
    return this.watchlistRepository.update(
      { id: watchlistId },
      {
        contentIds: () => `array_append(content_ids, ${contentId})`,
      },
    );
  }

  async removeVideoFromWatchlist(watchlistId: number, contentId: number) {
    const watchlist = await this.watchlistRepository.findOne({
      where: {
        id: watchlistId,
        contentIds: Raw((alias) => `${alias} @> ARRAY[${contentId}]`),
      },
    });
    if (!watchlist) {
      throw new RpcException('Video does not exist in watchlist !');
    }
    return this.watchlistRepository.update(watchlistId, {
      contentIds: () => `array_remove(content_ids, ${contentId})`,
    });
  }

  async deleteWatchlist(watchlistId: number) {
    const watchlist = await this.watchlistRepository.findOne({
      where: { id: watchlistId },
    });
    if (!watchlist) {
      throw new RpcException('Watchlist does not exist !');
    }
    return this.watchlistRepository.softDelete(watchlistId);
  }

  // Bookmark
  async getAllBookmark(userId: number) {
    return this.bookmarkRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
  async createBookmark(createBookmarkDto: CreateBookmarkDto) {
    const bookmark = this.watchlistRepository.create({ ...createBookmarkDto });
    return this.bookmarkRepository.save(bookmark);
  }

  async deleteBookmark(id: number) {
    const bookmark = await this.watchlistRepository.findOne({ where: { id } });
    if (!bookmark) {
      throw new RpcException('Bookmark does not exist !');
    }
    return this.bookmarkRepository.softDelete(id);
  }

  // History
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
