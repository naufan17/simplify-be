import { Module } from '@nestjs/common';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import { QrcodeRepository } from './repository/qrcode.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qrcode } from './entity/qrcode.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessJwtStrategy } from 'src/common/strategy/passport/access-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qrcode]),
    JwtModule
  ],
  controllers: [QrcodeController],
  providers: [
    QrcodeService, 
    QrcodeRepository,
    AccessJwtStrategy,
  ]
})

export class QrcodeModule {}
