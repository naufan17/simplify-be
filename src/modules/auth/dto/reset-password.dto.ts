import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class resetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword!: string;
}