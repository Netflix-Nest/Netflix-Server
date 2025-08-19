import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { Bookmark } from './bookmark/entities/bookmark.entity';
import { History } from './history/entities/history.entity';
import { Watchlist } from './watchlist/entities/watchlist.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Bookmark, History, Watchlist],
  migrations: ['src/migrations/*.ts'],
  ssl: true,
});
