import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePieUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  Rafiale: string;

  @IsOptional()
  @IsString()
  empNo: string;

  @IsOptional()
  @IsString()
  bobby: string;

  @IsOptional()
  @IsString()
  sammy: string;

  @IsNotEmpty()
  @IsString()
  pieUserGroup: string;

  @IsNotEmpty()
  @IsNumber()
  pieUser: number;
}
