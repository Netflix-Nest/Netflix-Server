import { Injectable } from '@nestjs/common';
import { CreateEngagementDto } from './dto/create-engagement.dto';
import { UpdateEngagementDto } from './dto/update-engagement.dto';

@Injectable()
export class EngagementService {
  create(createEngagementDto: CreateEngagementDto) {
    return 'This action adds a new engagement';
  }

  findAll() {
    return `This action returns all engagement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} engagement`;
  }

  update(id: number, updateEngagementDto: UpdateEngagementDto) {
    return `This action updates a #${id} engagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} engagement`;
  }
}
