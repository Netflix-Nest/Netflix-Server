import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
