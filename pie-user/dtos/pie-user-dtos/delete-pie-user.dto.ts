import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePieUserDto {
  @IsUUID(4)
  id: string;
}
