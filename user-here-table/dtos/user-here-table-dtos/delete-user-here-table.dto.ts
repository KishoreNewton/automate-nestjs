import { IsNotEmpty, IsUUID, } from "class-validator";

export class DeleteUserHereTableDto {
  @IsUUID(4)
  id: string;
}