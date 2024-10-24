import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        ttl: configService.get<number>('THROTTLE_TTL', 60000),
        limit: configService.get<number>('THROTTLE_LIMIT', 20), 
      }]
    }),
  ],  
})

export class ThrottleModule {}