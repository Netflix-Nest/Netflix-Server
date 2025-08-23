import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const { name, permissionIds } = createRoleDto;
    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });
    const existRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (existRole) {
      throw new RpcException('Role have already exist !');
    }
    const role = this.roleRepository.create({
      name,
      permissions,
    });
    return this.roleRepository.save(role);
  }

  findAll() {
    return `This action returns all role`;
  }

  async findOne(name: string) {
    const role = await this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
    return role?.permissions;
  }
  async updateRole(id: number, dto: UpdateRoleDto) {
    const { name, permissionIds = [] } = dto;

    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new RpcException('Role not found');

    if (name) {
      const existRole = await this.roleRepository.findOne({
        where: { name },
      });
      if (existRole) {
        throw new RpcException('Role have already exist !');
      }
      role.name = name;
    }

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    role.permissions = permissions;

    return this.roleRepository.save(role);
  }

  remove(id: number) {
    return this.roleRepository.softDelete(id);
  }
}
