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
import {
  AddHistoryDto,
  CreateBookmarkDto,
  CreateEngagementDto,
  CreateWatchlistDto,
} from "./dto/create-engagement.dto";
import {
  UpdateEngagementDto,
  UpdateWatchlistDto,
} from "./dto/update-engagement.dto";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { User } from "src/common/decorators/customize";
import { IUserDecorator } from "src/interfaces/auth.interfaces";

@Controller("engagement")
export class EngagementController {
  constructor(
    @Inject("ENGAGEMENT_SERVICE") private readonly engagementClient: ClientProxy
  ) {}
  // bookmark
  @Get("bookmark")
  getAllBookmark(@Body() { userId }: { userId: number }) {
    return lastValueFrom(
      this.engagementClient.send("get-all-bookmark", userId)
    );
  }

  @Post("bookmark")
  createBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @User() user: IUserDecorator
  ) {
    console.log("receive request....");
    if (!createBookmarkDto.userId) {
      createBookmarkDto.userId = user.userId;
    }
    return lastValueFrom(
      this.engagementClient.send("create-bookmark", createBookmarkDto)
    );
  }

  @Delete("bookmark/:id")
  deleteBookmark(@Param("id") id: number) {
    console.log(id);
    return lastValueFrom(this.engagementClient.send("delete-bookmark", id));
  }

  // watchlist
  @Post("watchlist")
  createWatchlist(@Body() createWatchlistDto: CreateWatchlistDto) {
    return lastValueFrom(
      this.engagementClient.send("create-watchlist", createWatchlistDto)
    );
  }

  @Patch("watchlist/:id")
  updateWatchlist(
    @Param("id") id: number,
    @Body() updateWatchlistDto: UpdateWatchlistDto
  ) {
    updateWatchlistDto.id = id;
    return lastValueFrom(
      this.engagementClient.send("update-watchlist", updateWatchlistDto)
    );
  }

  @Get("watchlist")
  getAllWatchlist(@User() user: IUserDecorator) {
    const userId = user.userId;
    return lastValueFrom(this.engagementClient.send("get-watchlists", userId));
  }

  @Get("watchlist/:id")
  getOneWatchlist(
    @Param("id") watchlistId: number,
    @User() user: IUserDecorator
  ) {
    const userId = user.userId;
    return lastValueFrom(
      this.engagementClient.send("get-watchlist", { userId, watchlistId })
    );
  }

  @Patch("watchlist")
  addToWatchlist(
    @Body()
    { watchlistId, contentId }: { watchlistId: number; contentId: number }
  ) {
    return lastValueFrom(
      this.engagementClient.send("add-video-to-watchlist", {
        watchlistId,
        contentId,
      })
    );
  }

  @Delete("watchlist/:id")
  removeFromWatchlist(
    @Body()
    { watchlistId, contentId }: { watchlistId: number; contentId: number }
  ) {
    return this.engagementClient.send("remove-video-from-watchlist", {
      watchlistId,
      contentId,
    });
  }

  @Delete("watchlist/:id")
  deleteWatchlist(@Param("id") watchlistId: number) {
    return lastValueFrom(
      this.engagementClient.send("delete-watchlist", watchlistId)
    );
  }

  // bookmark
  @Get("history/")
  getHistory(@User() user: IUserDecorator) {
    const userId = user.userId;
    return lastValueFrom(this.engagementClient.send("get-history", userId));
  }

  @Post("history")
  addHistory(@Body() addHistoryDto: AddHistoryDto) {
    return lastValueFrom(
      this.engagementClient.send("add-history", addHistoryDto)
    );
  }
}
