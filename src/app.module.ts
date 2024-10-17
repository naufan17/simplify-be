import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CustomLogger } from "./logger/logger.service";
import { AppController } from "./app/app.controller";
import { RateLimitModule } from './rate_limit/rate_limit.module';

@Module({
  imports: [
    DatabaseModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [CustomLogger],
  exports: [CustomLogger],
})

export class AppModule {}