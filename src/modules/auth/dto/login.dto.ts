import { IsEmail, IsNotEmpty, Matches, MinLength,  } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  
  @IsNotEmpty()
  @MinLength(12)
  @Matches(/(?=.*[a-z])/, { message: 'password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'password must contain at least one number' })  
  password!: string;
}