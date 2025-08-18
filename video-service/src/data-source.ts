import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    require('./actor/entities/actor.entity').Actor,
    require('./content/entities/content.entity').Content,
    require('./genre/entities/genre.entity').Genre,
    require('./tag/entities/tag.entity').Tag,
    require('./series/entities/series.entity').Series,
    require('./video/entities/video.entity').Video,
  ],
  migrations: ['src/migrations/*.ts'],
  ssl: true,
});
