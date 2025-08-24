import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from '@netflix-clone/types';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}
  async getAllBookmark(userId: number) {
    return this.bookmarkRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
  async createBookmark(createBookmarkDto: CreateBookmarkDto) {
    const bookmark = this.bookmarkRepository.create({ ...createBookmarkDto });
    return this.bookmarkRepository.save(bookmark);
  }

  async deleteBookmark(id: number) {
    const bookmark = await this.bookmarkRepository.findOne({ where: { id } });
    if (!bookmark) {
      throw new RpcException('Bookmark does not exist !');
    }
    return this.bookmarkRepository.softDelete(id);
  }
}
