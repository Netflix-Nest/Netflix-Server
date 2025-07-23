import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(['ADMIN', 'USER'])
  role: string;

  @IsOptional()
  avatar?: string;
}
