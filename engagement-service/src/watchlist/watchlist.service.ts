import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Raw, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateWatchlistDto } from '@netflix-clone/types';
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

  async changeExist(watchlistIds: number[], contentId: number, add: boolean) {
    if (!watchlistIds || watchlistIds.length === 0) {
      throw new RpcException('Watchlist IDs array cannot be empty!');
    }

    if (add) {
      await this.watchlistRepository
        .createQueryBuilder()
        .update()
        .set({
          contentIds: () => `array_append(content_ids, ${contentId})`,
        })
        .where('id IN (:...watchlistIds)', { watchlistIds })
        .andWhere(`NOT (content_ids @> ARRAY[${contentId}])`)
        .execute();
    } else {
      await this.watchlistRepository
        .createQueryBuilder()
        .update()
        .set({
          contentIds: () => `array_remove(content_ids, ${contentId})`,
        })
        .where('id IN (:...watchlistIds)', { watchlistIds })
        .andWhere(`content_ids @> ARRAY[${contentId}]`)
        .execute();
    }

    return {
      success: true,
      data: true,
      message: `Content ${add ? 'added to' : 'removed from'} watchlists successfully`,
    };
  }

  async removeVideosFromWatchlist(ids: number[], listId: number) {
    const watchlist = await this.watchlistRepository.findOne({
      where: {
        id: listId,
      },
    });
    if (!watchlist) {
      throw new RpcException('Watchlist not found!');
    }
    return this.watchlistRepository.update({ id: listId }, { contentIds: ids });
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
