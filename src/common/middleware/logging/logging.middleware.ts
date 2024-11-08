import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start: number = Date.now();
    const { method, originalUrl, ip, headers }: Request = req;
    const userAgent: string | undefined = headers['user-agent'] || 'unknown';
    const clientIp: string | string[] | undefined = headers['x-forwarded-for'] || ip;

    res.on('finish', () => {
      const { statusCode }: Response = res;
      const responseTime: number = Date.now() - start;

      this.logger.log(`[${method}] ${originalUrl} | [${clientIp}] ${userAgent} | [${statusCode}] +${responseTime}ms`);
    });

    next();
  }
}
