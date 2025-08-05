import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EngagementService } from './engagement.service';
import { CreateEngagementDto } from './dto/create-engagement.dto';
import { UpdateEngagementDto } from './dto/update-engagement.dto';

@Controller()
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @MessagePattern('createEngagement')
  create(@Payload() createEngagementDto: CreateEngagementDto) {
    return this.engagementService.create(createEngagementDto);
  }

  @MessagePattern('findAllEngagement')
  findAll() {
    return this.engagementService.findAll();
  }

  @MessagePattern('findOneEngagement')
  findOne(@Payload() id: number) {
    return this.engagementService.findOne(id);
  }

  @MessagePattern('updateEngagement')
  update(@Payload() updateEngagementDto: UpdateEngagementDto) {
    return this.engagementService.update(updateEngagementDto.id, updateEngagementDto);
  }

  @MessagePattern('removeEngagement')
  remove(@Payload() id: number) {
    return this.engagementService.remove(id);
  }
}
