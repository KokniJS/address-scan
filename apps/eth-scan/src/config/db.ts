import { registerAs } from '@nestjs/config';
import { Transaction } from '../transaction/transaction.entity';

export default registerAs('db', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Transaction],
  synchronize: false,
}));
