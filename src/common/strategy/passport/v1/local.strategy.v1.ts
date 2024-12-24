/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthServiceV1 } from "../../../../modules/auth/v1/auth.service.v1";
import { User } from "src/modules/user/entity/user.entity";

@Injectable()
export class LocalStrategyV1 extends PassportStrategy(Strategy, 'localV1') {
  constructor(private readonly authService: AuthServiceV1) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User | null = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
      
    return user;
  }
}