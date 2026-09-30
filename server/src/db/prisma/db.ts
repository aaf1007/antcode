import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d.ts';
import contractJson from './contract.json' with { type: 'json' };

const url = process.env['DATABASE_URL'];
if (!url) throw new Error('DATABASE_URL is required for the problem catalog database.');

export const db = postgres<Contract>({
  contractJson,
  url,
});
