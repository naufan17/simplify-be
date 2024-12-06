import { IsNotEmpty, IsString } from "class-validator";

export class RedirectUrlDto {
  
  @IsNotEmpty()
  @IsString()
  urlId!: string;
}