import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query(`SELECT 1 + 1 AS result`);
      console.log('⚡️[server]: Database connected');
    } catch (error) {
      console.error('⚡️[server]: Database connection failed :', error);
    }
  }
}