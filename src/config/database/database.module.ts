import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Qrcode } from 'src/modules/qrcode/entity/qrcode.entity';
import { Url } from 'src/modules/shorten-url/entity/url.entity';
import { Session } from 'src/modules/user/entity/session.entity';
import { User } from 'src/modules/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get< 'postgres' | 'mysql' | 'mongodb' >('DATABASE'),
        url: configService.get<string>('DATABASE_URL'),
        synchronize: configService.get<boolean>('DATABASE_SYNC'),
        logging: configService.get<boolean>('DATABASE_LOG'),
        cache: configService.get<boolean>('DATABASE_CACHE'),
        extra: {
          poolSize: configService.get<number>('DATABASE_POOL_SIZE'),
          timezone: configService.get<string>('DATABASE_TIMEZONE'),
          ssl: false
        },
        entities: [User, Session, Url, Qrcode],
        migrations: ['../../../database/migrations/*.ts'],
      }),
    }),
  ]
})

export class DatabaseModule {};