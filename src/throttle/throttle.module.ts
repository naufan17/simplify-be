import { Module } from '@nestjs/common';
import { ThrottlerModule } from "@nestjs/throttler";
import { TestController } from './test.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 20
    }]),
  ],  
  controllers: [TestController],
})

export class ThrottleModule {}