import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RecommendationModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
