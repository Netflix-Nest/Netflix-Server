import { Controller } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';

@Controller()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}
  //Watchlist
  @MessagePattern('create-watchlist')
  async createWatchlist(@Payload() createWatchlistDto: CreateWatchlistDto) {
    return this.watchlistService.createWatchlist(createWatchlistDto);
  }

  @MessagePattern('update-watchlist')
  async updateWatchlist(@Payload() updateWatchlistDto: UpdateWatchlistDto) {
    return this.watchlistService.updateWatchlist(updateWatchlistDto);
  }
  @MessagePattern('get-watchlists')
  async getAllWatchlist(@Payload() userId: number) {
    return this.watchlistService.getAllWatchlist(userId);
  }

  @MessagePattern('get-watchlist')
  async getOneWatchlist(
    @Payload() { userId, watchlistId }: { userId: number; watchlistId: number },
  ) {
    return this.watchlistService.getOneWatchlist(userId, watchlistId);
  }

  @MessagePattern('add-video-to-watchlist')
  async addToWatchlist(
    @Payload()
    { contentId, watchlistId }: { contentId: number; watchlistId: number },
  ) {
    return this.watchlistService.addVideoToWatchlist(contentId, watchlistId);
  }

  @MessagePattern('remove-video-from-watchlist')
  async removeVideo(
    @Payload()
    { watchlistId, contentId }: { watchlistId: number; contentId: number },
  ) {
    return this.watchlistService.removeVideoFromWatchlist(
      watchlistId,
      contentId,
    );
  }

  @MessagePattern('delete-watchlist')
  async deleteWatchlist(@Payload() watchlistId: number) {
    return this.watchlistService.deleteWatchlist(watchlistId);
  }
}
