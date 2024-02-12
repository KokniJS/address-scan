import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';

@Injectable()
export class CronService {
  private logger = new Logger('Cron');
  constructor(private readonly transactionService: TransactionService) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  async createSitemap() {
    await this.transactionService.fetchTransactions();
    this.logger.debug('Finished job fetch transactions');
  }
}
