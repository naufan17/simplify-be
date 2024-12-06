import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

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