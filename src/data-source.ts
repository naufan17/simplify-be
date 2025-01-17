import { DataSource } from 'typeorm';
import { User } from './modules/user/entity/user.entity';
import { Url } from './modules/shorten-url/entity/url.entity';
import { Session } from './modules/user/entity/session.entity';
import dotenv from 'dotenv';
import { Qrcode } from './modules/qrcode/entity/qrcode.entity';

dotenv.config();

interface DatabaseConfig {
  NODE_ENV: 'production' | 'development' | 'testing';
  DATABASE: 'postgres' | 'mysql' | 'mongodb';
  DATABASE_URL: string;
  DATABASE_TIMEZONE: string;
  DATABASE_SYNC: boolean;
  DATABASE_LOG: boolean;
  DATABASE_CACHE: boolean;
}

const {
  NODE_ENV, 
  DATABASE, 
  DATABASE_URL, 
  DATABASE_TIMEZONE, 
  DATABASE_SYNC, 
  DATABASE_LOG, 
  DATABASE_CACHE 
} = process.env as unknown as Partial<DatabaseConfig>;
if (!NODE_ENV || !DATABASE || !DATABASE_URL || !DATABASE_TIMEZONE || !DATABASE_SYNC || !DATABASE_LOG || !DATABASE_CACHE) throw new Error('Missing database configuration')
 
const dataSource: DataSource = new DataSource({
  type: DATABASE,
  url: DATABASE_URL,
  timezone: DATABASE_TIMEZONE,
  synchronize: DATABASE_SYNC,
  logging: DATABASE_LOG,
  cache: DATABASE_CACHE,
  extra: {
    poolSize: 10,
    ssl: false
  },
  entities: [User, Session, Url, Qrcode],
  migrations: ['../database/migrations/*.ts'],
});

export default dataSource;
