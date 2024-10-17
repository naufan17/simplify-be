/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: any = ctx.getResponse();
    const status: number = HttpStatus.TOO_MANY_REQUESTS;

    response.status(status).json({
      status: 'Failed', 
      message: 'Too many requests, please try again later' 
    });
  }
}
