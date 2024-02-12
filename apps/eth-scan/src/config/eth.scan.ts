import { registerAs } from '@nestjs/config';

export default registerAs('scan', () => ({
  apiUrl: process.env.ETHERSCAN_API_URL,
  apiToken: process.env.ETHERSCAN_API_TOKEN,
  startBlockNumber: Number(process.env.START_BLOCK_NUMBER),
}));
