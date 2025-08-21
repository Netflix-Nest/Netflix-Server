import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { Permission } from './permission/entities/permission.entity';
import { Role } from './role/entities/role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    require('./permission/entities/permission.entity').Permission,
    require('./role/entities/role.entity').Role,
  ],
  migrations: ['src/migrations/*.ts'],
  ssl: true,
});
