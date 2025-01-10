import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query(`SELECT 1 + 1 AS result`);
      console.log('⚡️[server]: Database connected');

      // Reset all tables in the database
      await this.resetDatabase();
    } catch (error) {
      console.error('⚡️[server]: Database connection failed :', error);
    }
  }

  async resetDatabase() {
    try {
      await this.dataSource.query(`SET session_replication_role = 'replica';`);

      const tables = await this.dataSource.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`);
      
      for (const table of tables) {
        await this.dataSource.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
        console.log(`Dropped table: ${table.tablename}`);
      }

      await this.dataSource.query(`SET session_replication_role = 'origin';`);

      console.log('⚡️[server]: All tables have been dropped successfully.');
    } catch (error) {
      console.error('⚡️[server]: Failed to reset database:', error);
    }
  }
}