import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserDto {
  @IsNumber()
  id: number;
}
