import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Url } from 'src/modules/shorten-url/entitiy/url.entitiy';
import { Session } from 'src/modules/user/entitiy/session.entity';
import { User } from 'src/modules/user/entitiy/user.entity';

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
        cache: true,
        extra: {
          poolSize: 10,
          ssl: configService.get<string>('NODE_ENV') === "production" 
          ? { rejectUnauthorized: false } 
          : false,  
        },
        timezone: configService.get<string>('DATABASE_TIMEZONE'),
        entities: [User, Session, Url],
        migrations: ['../../../database/migrations/*.ts'],
      }),
    }),
  ]
})

export class DatabaseModule {};