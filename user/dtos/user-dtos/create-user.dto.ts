import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  empNo: string;

  @IsOptional()
  @IsString()
  organizationEmailId: string;

  @IsNotEmpty()
  @IsString()
  empStatus: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;
}