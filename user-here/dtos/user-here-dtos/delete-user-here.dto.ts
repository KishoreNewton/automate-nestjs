import { IsNotEmpty, IsUUID, } from "class-validator";

export class DeleteUserHereDto {
  @IsUUID(4)
  id: string;
}