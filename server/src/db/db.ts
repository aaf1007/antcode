import dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'antcode',
  process.env.DB_USER ?? 'postgres',
  process.env.DB_PASSWORD ?? 'root',
  {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432, // converts to env value to Number
    dialect: 'postgres',
    logging: false, // set to console.log to see the generated SQL for each call below
  }
);
