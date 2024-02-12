import { Injectable, Inject, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import ethScan from '../config/eth.scan';
import { ConfigType } from '@nestjs/config';
import { TransactionAttrs } from './interfaces/transactionAttrs';
import { TransactionRepository } from './transaction.repository';
import { ITransactionRepository } from './interfaces/transaction.repository';

@Injectable()
export class TransactionService {
  private logger = new Logger('Transaction');
  constructor(
    @Inject(ethScan.KEY)
    private readonly scanConfig: ConfigType<typeof ethScan>,
    @Inject(TransactionRepository)
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async fetchTransactions() {
    const lastBlockNumber = await this.getCurrentLastBlockNumber();
    this.logger.debug(
      `Fetched last block hex: ${this.transformNumberToHex(
        lastBlockNumber
      )} number: ${lastBlockNumber}`
    );
    let i = this.scanConfig.startBlockNumber;
    do {
      const blockHexNumber = this.transformNumberToHex(i);
      const { result } = await this.getBlockByHexNumber(blockHexNumber);
      const transactions = result.transactions
        .map((transaction) => {
          if (!transaction?.to || !transaction.from) {
            return false;
          }
          return this.create({
            hexBlockNumber: blockHexNumber,
            blockNumber: i.toString(),
            hexValue: transaction.value,
            value: this.transformHexToNumber(transaction.value).toString(),
            to: transaction.to,
            from: transaction.from,
          });
        })
        .filter(Boolean);
      await Promise.all(transactions);
      this.logger.debug(
        `Created transactions from block hex: ${blockHexNumber} number: ${i} transaction length: ${transactions.length}`
      );
      i++;
    } while (i !== lastBlockNumber);
  }

  async getBlockByHexNumber(blockHexNumber: string) {
    const url = this.addBlockHexNumberToApiUrl(blockHexNumber);
    let block;
    while (!block) {
      const response = await this.fetch(url);
      if (!response || response.status === '0') {
        continue;
      }
      block = response;
    }
    return block;
  }

  async getCurrentLastBlockNumber() {
    let lastBlockNumber: number;
    while (!lastBlockNumber) {
      const response = await this.fetch(
        `${this.scanConfig.apiUrl}?module=proxy&action=eth_blockNumber`
      );
      const blockNumber = this.transformHexToNumber(response.result);
      if (!blockNumber) {
        continue;
      }
      lastBlockNumber = blockNumber;
    }
    return lastBlockNumber;
  }

  async getMostChangedAddress() {
    return this.transactionRepository.getMostChangedAddress();
  }

  async create(creationAttrs: TransactionAttrs) {
    return this.transactionRepository.create(creationAttrs);
  }

  async fetch(url: string) {
    const req = await fetch(url);
    return req.json();
  }

  transformNumberToHex(number: number): string {
    return number.toString(16);
  }

  transformHexToNumber(hex: string) {
    return parseInt(hex, 16);
  }

  addBlockHexNumberToApiUrl(blockHexNumber: string): string {
    return `${this.scanConfig.apiUrl}?module=proxy&action=eth_getBlockByNumber&tag=${blockHexNumber}&boolean=true&apikey=${this.scanConfig.apiToken}`;
  }
}
