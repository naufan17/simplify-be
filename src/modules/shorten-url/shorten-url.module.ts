import { Module } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrlController } from './shorten-url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entity/url.entity';
import { UrlRepository } from './repository/url.repository';
import { JwtModule } from '@nestjs/jwt/dist';
import { AccessJwtStrategy } from 'src/common/strategy/passport/access-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url]),
    JwtModule,
  ],
  controllers: [ShortenUrlController],
  providers: [
    ShortenUrlService, 
    UrlRepository,
    AccessJwtStrategy, 
  ],
})

export class ShortenUrlModule {}
