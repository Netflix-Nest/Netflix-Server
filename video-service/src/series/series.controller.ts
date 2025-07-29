import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Controller()
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @MessagePattern('createSeries')
  create(@Payload() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @MessagePattern('findAllSeries')
  findAll() {
    return this.seriesService.findAll();
  }

  @MessagePattern('findOneSeries')
  findOne(@Payload() id: number) {
    return this.seriesService.findOne(id);
  }

  @MessagePattern('updateSeries')
  update(@Payload() updateSeriesDto: UpdateSeriesDto) {
    return this.seriesService.update(updateSeriesDto.id, updateSeriesDto);
  }

  @MessagePattern('removeSeries')
  remove(@Payload() id: number) {
    return this.seriesService.remove(id);
  }
}
