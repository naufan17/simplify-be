import { IsEmail, IsEnum, IsHexColor, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class EmailDto {
  
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsNumber()
  margin?: number;

  @IsOptional()
  @IsHexColor()
  dotsColor?: string;

  @IsOptional()
  @IsEnum(['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'])
  dotsType?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';

  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @IsOptional()
  @IsHexColor()
  cornersSquareColor?: string;

  @IsOptional()
  @IsEnum(['dot', 'square', 'extra-rounded'])
  cornersSquareType?: 'dot' | 'square' | 'extra-rounded';

  @IsOptional()
  @IsHexColor()
  cornersDotColor?: string;

  @IsOptional()
  @IsEnum(['dot', 'square'])
  cornersDotType?: 'dot' | 'square';
}