import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [ConfigModule, TransactionModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
