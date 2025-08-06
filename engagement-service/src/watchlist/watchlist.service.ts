import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Raw, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
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
    return this.watchlistRepository.find({ where: { userId: userId } });
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
}
