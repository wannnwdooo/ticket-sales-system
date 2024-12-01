import { plainToInstance } from 'class-transformer';
import { TransactionViewDto } from '../dto';
import { Transaction } from '../entities/transaction.entity';

export function mapToViewTransaction(
  transaction: Transaction,
): TransactionViewDto {
  return plainToInstance(TransactionViewDto, transaction, {
    excludeExtraneousValues: true,
  });
}
