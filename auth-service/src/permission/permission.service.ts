import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    const per = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(per);
  }

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsRepository.update(
      { id },
      { ...updatePermissionDto },
    );
  }

  remove(id: number) {
    return this.permissionsRepository.softDelete(id);
  }
}
