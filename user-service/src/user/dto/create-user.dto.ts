import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { StatusUser, UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  viewingTime: number;

  @IsNotEmpty()
  status: StatusUser;
}
