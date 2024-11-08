/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../../../modules/auth/auth.service";
import { User } from "src/modules/user/entitiy/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User | null = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
      
    return user;
  }
}