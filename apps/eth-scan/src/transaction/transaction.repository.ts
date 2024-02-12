import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from './interfaces/transaction.repository';
import { TransactionAttrs } from './interfaces/transactionAttrs';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangesAddressDto } from './dto/changes.address.dto';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {
    this.getMostChangedAddress();
  }

  async create(creationAttrs: TransactionAttrs): Promise<Transaction> {
    return this.transactionRepository.save(creationAttrs);
  }

  async getMostChangedAddress(): Promise<ChangesAddressDto> {
    const query = `
    WITH RECURSIVE last_blocks AS (
        SELECT DISTINCT "blockNumber"::integer
        FROM "transaction"
        ORDER BY "blockNumber"::integer DESC
        LIMIT 100
      ),
      aggregated_balance_changes AS (
        SELECT 
          "from" AS address,
          SUM("value"::numeric) * -1 AS balance_change
        FROM 
          "transaction"
        WHERE 
          "blockNumber"::integer IN (SELECT "blockNumber" FROM last_blocks)
        GROUP BY 
          "from"
        
        UNION ALL
        
        SELECT 
          "to" AS address,
          SUM("value"::numeric) AS balance_change
        FROM 
          "transaction"
        WHERE 
          "blockNumber"::integer IN (SELECT "blockNumber" FROM last_blocks)
        GROUP BY 
          "to"
      ),
      combined_balance_changes AS (
        SELECT 
          address, 
          SUM(balance_change) AS total_balance_change
        FROM 
          aggregated_balance_changes
        GROUP BY 
          address
      )
      SELECT 
        address,
        total_balance_change
      FROM 
        combined_balance_changes
      ORDER BY 
        ABS(total_balance_change) DESC
      LIMIT 1;     
    `;
    const result = await this.transactionRepository.query(query);
    return result[0];
  }

  /*
 async deprecatedQuery() {
    const initQuery =
    this.transactionRepository.createQueryBuilder('transaction');

  const lastBlocks = await initQuery
    .select('DISTINCT(transaction.blockNumber)', 'blockNumber')
    .orderBy('transaction.blockNumber', 'DESC')
    .limit(100)
    .getRawMany();

  const blockNumbers = lastBlocks.map((block) => block.blockNumber);

  const fromChanges = await this.transactionRepository
    .createQueryBuilder('transaction')
    .select('"from"', 'address')
    .addSelect('sum(transaction.value::numeric)', 'balance_change')
    .where('transaction.blockNumber IN (:...blockNumbers)', { blockNumbers })
    .groupBy('"from"')
    .getRawMany();

  const toChanges = await this.transactionRepository
    .createQueryBuilder('transaction')
    .select('"to"', 'address')
    .addSelect('sum(transaction.value::numeric)', 'balance_change')
    .where('transaction.blockNumber IN (:...blockNumbers)', { blockNumbers })
    .groupBy('"to"')
    .getRawMany();

  const balanceMap = new Map();

  fromChanges.forEach((change) => {
    balanceMap.set(
      change.address,
      (balanceMap.get(change.address) || 0) -
        parseFloat(change.balance_change)
    );
  });
  toChanges.forEach((change) => {
    balanceMap.set(
      change.address,
      (balanceMap.get(change.address) || 0) +
        parseFloat(change.balance_change)
    );
  });

  let maxChangeAddress = null;
  let maxChangeValue = 0;
  for (let [address, change] of balanceMap.entries()) {
    if (Math.abs(change) > maxChangeValue) {
      maxChangeAddress = address;
      maxChangeValue = Math.abs(change);
    }
  }
  console.log(maxChangeAddress, maxChangeValue);
  } */
}
