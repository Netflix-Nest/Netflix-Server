import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  apiPath: string;
}
