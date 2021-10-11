import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateUserHereDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  empNo: string;

  @IsOptional()
  @IsString()
  organizationEmailId: string;

  @IsOptional()
  @IsString()
  empStatus: string;

  @IsOptional()
  @IsString()
  mobileNumber: string;
}