import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from '@netflix-clone/types';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  id: number;
}
