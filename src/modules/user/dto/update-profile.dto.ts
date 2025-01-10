import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class UpdateProfileDto {
  
  @IsString()
  @IsOptional()
  name!: string;

  @IsEmail()
  @IsOptional()
  email!: string;

  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Phone number must be a valid Indonesian number starting with +62' })
  @Length(11, 14, { message: 'Phone number must be between 11 to 15 characters' })
  phoneNumber?: string;
}