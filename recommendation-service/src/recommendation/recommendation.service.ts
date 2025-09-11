import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecommendationService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('VIDEO_SERVICE') private readonly videoClient: ClientProxy,
  ) {}
  async recommend(
    id: number,
    page: number,
    limit: number,
    excludeIds: number[],
  ) {
    const user = await lastValueFrom(this.userClient.send('find-user', id));
    if (!user) throw new RpcException('User not found !');
    const favoriteGenre = user.favoriteGenre;

    // If user have not fav genres, mock fav gen 1, 2 temporary
    if (favoriteGenre.length === 0) {
      favoriteGenre.push(1, 2);
    }
    const data = await lastValueFrom(
      this.videoClient.send('find-content-by-genres', {
        favoriteGenreIds: favoriteGenre,
        page,
        limit,
        excludeIds,
      }),
    );
    return data;
  }
}
