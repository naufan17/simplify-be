import { Module } from "@nestjs/common";
import { DatabaseModule } from "../config/database/database.module";
import { AppController } from "./app.controller";
import { ThrottleModule } from '../config/throttle/throttle.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggingInterceptor } from "../common/interceptors/logging/logging.interceptor";
import { LoggerModule } from '../config/logger/logger.module';

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