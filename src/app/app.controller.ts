import { Controller, Get } from '@nestjs/common';
import { CustomLogger } from '../logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly logger: CustomLogger) {}

  @Get()
  getHello() {
    this.logger.log('Welcome to API Simplify version 1.0');

    return {
      status: 'Success',
      message: 'Welcome to API Simplify',
      data: {
        version: '1.0',
      }
    }
  }
}