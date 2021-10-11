import { IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  dean: string;

  @IsOptional()
  @IsString()
  cass: string;

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
