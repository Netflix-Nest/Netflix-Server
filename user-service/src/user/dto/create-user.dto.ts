import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';

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

  @IsEnum(['ADMIN', 'USER'])
  role: string;

  @IsOptional()
  avatar?: string;
}
