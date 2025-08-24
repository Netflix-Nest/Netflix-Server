import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from '@netflix-clone/types';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  id: number;
}
