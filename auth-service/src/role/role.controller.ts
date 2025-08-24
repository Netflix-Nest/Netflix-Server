import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CreateRoleDto } from '@netflix-clone/types';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('createRole')
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @MessagePattern('findAllRole')
  findAll() {
    return this.roleService.findAll();
  }

  @MessagePattern('findOneRole')
  findOne(@Payload() name: string) {
    return this.roleService.findOne(name);
  }

  @MessagePattern('updateRole')
  update(@Payload() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(updateRoleDto.id, updateRoleDto);
  }

  @MessagePattern('removeRole')
  remove(@Payload() id: number) {
    return this.roleService.remove(id);
  }
}
