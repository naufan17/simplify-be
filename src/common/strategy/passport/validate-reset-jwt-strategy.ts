import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { JwtPayload } from "src/types/jwt-payload";
import { Request } from "express";

@Injectable()
export class ValidateResetJwtStrategy extends PassportStrategy(Strategy, 'jwt-reset-validate') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.query.token || req.params['token'];
        if (!token) throw new UnauthorizedException('Token not found');
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_RESET_TOKEN'),
    });
  }

  async validate(payload: JwtPayload): Promise<{ sub: string }> {
    return { sub: payload.sub };
  }
}