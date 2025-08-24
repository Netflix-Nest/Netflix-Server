import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@netflix-clone/types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserTokenDto {
  refreshToken: string;
  userId: number;
}
