import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/types/jwt-payload";

@Injectable()
export class ResetJwtStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_RESET_TOKEN'),
    });
  }

  async validate(payload: JwtPayload): Promise<{ sub: string }> {
    return { sub: payload.sub };
  }
}