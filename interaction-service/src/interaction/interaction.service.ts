import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InteractionService {
  constructor(
    @Inject('VIDEO_SERVICE') private readonly videoClient: ClientProxy,
  ) {}
  async like(contentId: number) {
    return lastValueFrom(this.videoClient.send('like-video', contentId));
  }

  async rate(contentId: number, rate: number) {
    return lastValueFrom(
      this.videoClient.send('rate-video', { contentId, rate }),
    );
  }
}
