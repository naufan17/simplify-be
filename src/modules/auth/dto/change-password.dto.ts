import { IsNotEmpty, Matches, MinLength } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class ChangePasswordDto {
 
  @IsNotEmpty()
  @MinLength(12)
  @Matches(/(?=.*[a-z])/, { message: 'password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'password must contain at least one number' })  
  password!: string;

  @IsNotEmpty()
  @MinLength(12)
  @Matches(/(?=.*[a-z])/, { message: 'confirm password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'confirm password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'confirm password must contain at least one number' })  
  @Match('password', { message: 'passwords do not match' })
  confirmPassword!: string;
}