import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecommendationService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('VIDEO_SERVICE') private readonly videoClient: ClientProxy,
  ) {}
  async recommend(id: number, page: number, limit: number) {
    const user = await lastValueFrom(this.userClient.send('find-user', id));
    if (!user) throw new RpcException('User not found !');
    const favoriteGenre = user.favoriteGenre;
    const data = await lastValueFrom(
      this.videoClient.send('find-content-by-genres', {
        favoriteGenreIds: favoriteGenre,
        page,
        limit,
      }),
    );
    return data;
  }
}
