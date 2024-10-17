/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: any = ctx.getResponse();
    const status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: 'Error',
      message: 'Something went wrong',
    });
  }
}
