import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { AppController } from "./app/app.controller";
import { ThrottleModule } from './throttle/throttle.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggingInterceptor } from "./common/interceptors/logging/logging.interceptor";
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    ThrottleModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [ 
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }, {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})

export class AppModule {}