/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;
    const userAgent = headers['user-agent'];
    const now = Date.now();
    const ip = request.ip;
    
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`${method} ${url} ${ip} ${userAgent} +${Date.now()-now}ms`)),
      );
  }
}
