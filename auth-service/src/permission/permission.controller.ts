import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from '@netflix-clone/types';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @MessagePattern('createPermission')
  create(@Payload() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @MessagePattern('findByIds')
  findAll() {
    return this.permissionService.findAll();
  }

  @MessagePattern('findOnePermission')
  findOne(@Payload() id: number) {
    return this.permissionService.findOne(id);
  }

  @MessagePattern('updatePermission')
  update(@Payload() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(
      updatePermissionDto.id,
      updatePermissionDto,
    );
  }

  @MessagePattern('removePermission')
  remove(@Payload() id: number) {
    return this.permissionService.remove(id);
  }
}
