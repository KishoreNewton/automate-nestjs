import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateUserHereTableDto {
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