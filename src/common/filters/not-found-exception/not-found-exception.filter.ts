/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: any = ctx.getResponse();
    const status: number = HttpStatus.NOT_FOUND;

    response.status(status).json({
      status: 'Failed',
      message: 'The requested resource could not be found',
    });
  }
}
