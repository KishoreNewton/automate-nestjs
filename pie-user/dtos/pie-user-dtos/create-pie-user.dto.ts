import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePieUserDto {
  @IsNotEmpty()
  @IsString()
  Rafiale: string;

  @IsOptional()
  @IsString()
  empNo: string;

  @IsNotEmpty()
  @IsString()
  bobby: string;

  @IsNotEmpty()
  @IsString()
  sammy: string;

  @IsNotEmpty()
  @IsString()
  pieUserGroup: string;

  @IsNotEmpty()
  @IsNumber()
  pieUser: number;
}
