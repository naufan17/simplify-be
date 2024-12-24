/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthServiceV2 } from "../../../../modules/auth/v2/auth.service.v2";
import { User } from "src/modules/user/entity/user.entity";

@Injectable()
export class LocalStrategyV2 extends PassportStrategy(Strategy, 'localV2') {
  constructor(private readonly authService: AuthServiceV2) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User | null = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
      
    return user;
  }
}