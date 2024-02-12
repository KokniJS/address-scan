import { ChangesAddressDto } from '../dto/changes.address.dto';
import { Transaction } from '../transaction.entity';
import { TransactionAttrs } from './transactionAttrs';

export interface ITransactionRepository {
  create(creationAttrs: TransactionAttrs): Promise<Transaction>;
  getMostChangedAddress(): Promise<ChangesAddressDto>;
}
