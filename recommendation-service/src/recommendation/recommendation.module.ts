import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { UserClientProvider } from 'src/providers/user-client.provider';
import { VideoClientProvider } from 'src/providers/video-client.provider';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, UserClientProvider, VideoClientProvider],
})
export class RecommendationModule {}
