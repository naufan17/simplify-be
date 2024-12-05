/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('jwt-access') {
  handleRequest(err: unknown, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') throw new UnauthorizedException('Access token has expired');
    if (info?.name === 'JsonWebTokenError') throw new UnauthorizedException('Invalid token');
    if (err || !user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
