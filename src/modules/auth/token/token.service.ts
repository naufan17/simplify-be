/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
    });
  }

  verifyAccessToken(accessToken: string): any {
    return this.jwtService.verify(accessToken, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
    });
  }

  verifyRefreshToken(refreshToken: string): any {
    return this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
    });
  }
}
