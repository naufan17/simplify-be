/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalAccessJwtAuthGuard extends AuthGuard('jwt-access') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: unknown, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') throw new UnauthorizedException('Access token has expired');
    if (info?.name === 'JsonWebTokenError') throw new UnauthorizedException('Invalid token');
    if (info?.name === 'TokenInvalidError') throw new UnauthorizedException('Invalid token');
    if (err || !user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
