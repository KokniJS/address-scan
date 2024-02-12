import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Transaction } from '../transaction/transaction.entity';

dotenv.config({ path: `.env` });

const migrationConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrations: ['apps/eth-scan/src/migrations/*{.ts,.js}'],
  entities: [Transaction],
});

export default migrationConfig;
