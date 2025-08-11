import {
	IsEmail,
	IsNotEmpty,
	Length,
	IsOptional,
	IsEnum,
	IsString,
} from "class-validator";
import { UserRole } from "src/interfaces/user.enum";

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@IsString()
	fullName: string;

	@IsNotEmpty()
	@IsString()
	username: string;

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
}
