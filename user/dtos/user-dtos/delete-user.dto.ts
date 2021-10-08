import { IsNotEmpty, IsUUID, } from "class-validator";

export class DeleteUserDto {
  @IsUUID(4)
  id: string;
}