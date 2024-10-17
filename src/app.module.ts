import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CustomLogger } from "./logger/logger.service";
import { AppController } from "./app/app.controller";
import { ThrottleModule } from './throttle/throttle.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    DatabaseModule,
    ThrottleModule,
  ],
  controllers: [AppController],
  providers: [CustomLogger, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [CustomLogger],
})

export class AppModule {}