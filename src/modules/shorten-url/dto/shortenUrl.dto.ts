import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class ShortenUrlDto {
  
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\S*$/, { message: 'Alias must not contain spaces' })
  alias?: string;
}