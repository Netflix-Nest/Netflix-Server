import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@netflix-clone/types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
