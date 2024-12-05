/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwt-payload';
import * as crypto from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  generateSecretKey(): string {
    return crypto.randomBytes(256).toString('hex');
  }

  updateAccessToken(secretKey: string): void {
    this.configService.set('JWT_SECRET_ACCESS_TOKEN', secretKey);
  }

  @Cron(CronExpression.EVERY_HOUR)
  rotateAccesssToken(): void {
    const accessToken = this.generateSecretKey();
    this.updateAccessToken(accessToken);

    console.log(`Rotated secret key access token: ${accessToken}`);
  }

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
    });
  }

  generateResetToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_RESET_TOKEN'),
      expiresIn: this.configService.get<string>('RESET_TOKEN_EXPIRES'),
    });
  }

  verifyAccessToken(accessToken: string): JwtPayload {
    return this.jwtService.verify(accessToken, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
    });
  }

  verifyResetToken(resetToken: string): JwtPayload {
    return this.jwtService.verify(resetToken, {
      secret: this.configService.get<string>('JWT_SECRET_RESET_TOKEN'),
    });
  }
}
