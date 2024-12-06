import { Module } from '@nestjs/common';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import { QrcodeRepository } from './repository/qrcode.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qrcode } from './entity/qrcode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qrcode]),
  ],
  controllers: [QrcodeController],
  providers: [
    QrcodeService, 
    QrcodeRepository
  ]
})

export class QrcodeModule {}
