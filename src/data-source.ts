import { DataSource } from 'typeorm';
import { User } from './modules/user/entitiy/user.entity';
import { Url } from './modules/shorten-url/entitiy/url.entitiy';
import { Session } from './modules/user/entitiy/session.entity';
import dotenv from 'dotenv';

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

const { NODE_ENV, DATABASE, DATABASE_URL, DATABASE_TIMEZONE, DATABASE_SYNC, DATABASE_LOG, DATABASE_CACHE } = process.env as unknown as DatabaseConfig;
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
  entities: [User, Session, Url],
  migrations: ['../database/migrations/*.ts'],
});

export default dataSource;
