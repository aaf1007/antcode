import "server-only";

import nextEnv from "@next/env";
import { Sequelize } from "sequelize";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

export const sequelize = new Sequelize(
  process.env.DB_NAME ?? "antcode",
  process.env.DB_USER ?? "postgres",
  process.env.DB_PASSWORD ?? "root",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: "postgres",
    logging: false,
  },
);
