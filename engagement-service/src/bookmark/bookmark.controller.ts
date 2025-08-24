import { Controller } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBookmarkDto } from '@netflix-clone/types';

@Controller()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
  @MessagePattern('get-all-bookmark')
  async getAllBookmark(@Payload() userId: number) {
    return this.bookmarkService.getAllBookmark(userId);
  }
  @MessagePattern('create-bookmark')
  async createBookmark(@Payload() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(createBookmarkDto);
  }

  @MessagePattern('delete-bookmark')
  async deleteBookmark(@Payload() id: number) {
    return this.bookmarkService.deleteBookmark(id);
  }
}
