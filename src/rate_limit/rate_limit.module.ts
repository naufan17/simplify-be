import { Module } from '@nestjs/common';
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 600, 
      limit: 100
    }]),
  ],  
})

export class RateLimitModule {}