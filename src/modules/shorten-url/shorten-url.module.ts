import { Module } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrlController } from './shorten-url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entity/url.entity';
import { UrlRepository } from './repository/url.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url])
  ],
  providers: [ShortenUrlService, UrlRepository],
  controllers: [ShortenUrlController]
})

export class ShortenUrlModule {}
