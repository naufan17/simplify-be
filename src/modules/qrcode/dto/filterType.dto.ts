import { IsEnum, IsOptional } from "class-validator";

export class FilterTypeDto {
  @IsOptional()
  @IsEnum(['text', 'wifi', 'url', 'email', 'whatsapp', 'social media'], { message: 'Invalid filter type' })
  filter?: 'text' | 'wifi' | 'url' | 'email' | 'whatsapp' | 'social media';
}