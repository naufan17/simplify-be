import { Module } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrlController } from './shorten-url.controller';

@Module({
  providers: [ShortenUrlService],
  controllers: [ShortenUrlController]
})
export class ShortenUrlModule {}
