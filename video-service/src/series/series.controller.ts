import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Controller()
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @MessagePattern('create-series')
  create(@Payload() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @MessagePattern('find-all-series')
  findAll(@Payload() data: { currentPage: number; limit: number; qs: string }) {
    const { currentPage, limit, qs } = data;
    return this.seriesService.findAll(currentPage, limit, qs);
  }

  @MessagePattern('find-one-series')
  findOne(@Payload() id: number) {
    return this.seriesService.findOne(id);
  }

  @MessagePattern('update-series')
  update(@Payload() data: { id: number; updateSeriesDto: UpdateSeriesDto }) {
    const { id, updateSeriesDto } = data;
    console.log(data);
    return this.seriesService.update(id, updateSeriesDto);
  }

  @MessagePattern('remove-series')
  remove(@Payload() id: number) {
    return this.seriesService.remove(id);
  }
}
