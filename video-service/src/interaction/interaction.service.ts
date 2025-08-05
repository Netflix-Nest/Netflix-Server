import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from 'src/content/entities/content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}
  async like(contentId: number) {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new RpcException('Content is invalid !');
    }
    content.likeCount++;
    return this.contentRepository.save(content);
  }

  async rate(contentId: number, rate: number) {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new RpcException('Content is invalid !');
    }
    content.ratingCount++;
    content.totalScoreRating += rate;
    return this.contentRepository.save(content);
  }
}
