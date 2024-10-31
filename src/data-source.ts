import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './modules/user/entitiy/user.entity';
import { Session } from 'inspector';
import { Url } from './modules/shorten-url/entitiy/url.entitiy';
 
const configService = new ConfigService();

export const dataSource = new DataSource({
  type: configService.get<'postgres' | 'mysql' | 'mongodb'>('DATABASE') as 'postgres' | 'mysql' | 'mongodb',
  url: configService.get<string>('DATABASE_URL'),
  timezone: configService.get<string>('DATABASE_TIMEZONE'),
  synchronize: configService.get<boolean>('DATABASE_SYNC'),
  logging: configService.get<boolean>('DATABASE_LOG'),
  cache: configService.get<boolean>('DATABASE_CACHE'),
  extra: {
    poolSize: 10,
    ssl: configService.get<string>('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
  },
  entities: [User, Session, Url],
  migrations: ['../database/migrations/*.ts'],
});

export default dataSource;
