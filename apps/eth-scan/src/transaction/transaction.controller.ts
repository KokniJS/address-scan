import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('largest-change')
  async getLargestChange() {
    return this.transactionService.getMostChangedAddress();
  }
}
