import { forwardRef, Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Content } from 'src/content/entities/content.entity';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Series, Content]),
    forwardRef(() => ContentModule),
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
