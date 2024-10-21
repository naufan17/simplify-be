import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) 
    private readonly logger: LoggerService
  ) {}

  @Get()
  getHello() {
    return {
      status: 'Success',
      message: 'Welcome to API Simplify',
      data: {
        version: '1.0',
      }
    }
  }
}