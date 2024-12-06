import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  rotateAccesssToken(): void {
    const accessToken = this.generateSecretKey();
    this.updateAccessToken(accessToken);

    console.log(`Rotated secret key access token: ${accessToken}`);
  }

  generateAccessToken(payload: { sub: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
    });
  }

  generateResetToken(payload: { sub: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_RESET_TOKEN'),
      expiresIn: this.configService.get<string>('RESET_TOKEN_EXPIRES'),
    });
  }

}
