import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  dean: string;

  @IsOptional()
  @IsString()
  cass: string;

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
