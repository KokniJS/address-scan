import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), ConfigModule],
  exports: [TransactionService],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
