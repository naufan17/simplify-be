import { Module } from '@nestjs/common';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule,
  ],
  controllers: [QrcodeController],
  providers: [QrcodeService, JwtModule]
})

export class QrcodeModule {}
