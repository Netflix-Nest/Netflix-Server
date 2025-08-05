import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EngagementService } from './engagement.service';
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

@Controller('engagement')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  //Watchlist
  @MessagePattern('create-watchlist')
  async createWatchlist(@Payload() createWatchlistDto: CreateWatchlistDto) {
    return this.engagementService.createWatchlist(createWatchlistDto);
  }

  @MessagePattern('update-watchlist')
  async updateWatchlist(@Payload() updateWatchlistDto: UpdateWatchlistDto) {
    return this.engagementService.updateWatchlist(updateWatchlistDto);
  }
  @MessagePattern('get-watchlists')
  async getAllWatchlist(@Payload() { userId }: { userId: number }) {
    return this.engagementService.getAllWatchlist(userId);
  }

  @MessagePattern('get-watchlist')
  async getOneWatchlist(
    @Payload() { userId, watchlistId }: { userId: number; watchlistId: number },
  ) {
    return this.engagementService.getOneWatchlist(userId, watchlistId);
  }

  @MessagePattern('add-video-to-watchlist')
  async addToWatchlist(
    @Payload()
    { contentId, watchlistId }: { contentId: number; watchlistId: number },
  ) {
    return this.engagementService.addVideoToWatchlist(contentId, watchlistId);
  }

  @MessagePattern('remove-video-from-watchlist')
  async removeVideo(
    @Payload()
    { watchlistId, contentId }: { watchlistId: number; contentId: number },
  ) {
    return this.engagementService.removeVideoFromWatchlist(
      watchlistId,
      contentId,
    );
  }

  @MessagePattern('delete-watchlist')
  async deleteWatchlist(@Payload() watchlistId: number) {
    return this.engagementService.deleteWatchlist(watchlistId);
  }

  // Bookmark
  @MessagePattern('get-all-bookmark')
  async getAllBookmark(@Payload() userId: number) {
    return this.engagementService.getAllBookmark(userId);
  }
  @MessagePattern('create-bookmark')
  async createBookmark(@Payload() createBookmarkDto: CreateBookmarkDto) {
    return this.engagementService.createBookmark(createBookmarkDto);
  }

  @MessagePattern('delete-bookmark')
  async deleteBookmark(@Payload() id: number) {
    return this.engagementService.deleteBookmark(id);
  }

  // History
  @MessagePattern('get-history')
  async getHistory(@Payload() userId: number) {
    return this.engagementService.getHistory(userId);
  }

  @MessagePattern('add-history')
  async addHistory(@Payload() addHistoryDto: AddHistoryDto) {
    return this.engagementService.addHistory(addHistoryDto);
  }
}
