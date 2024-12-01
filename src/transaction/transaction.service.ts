import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { TransactionViewDto } from './dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './enums';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  public async create(
    data: DeepPartial<Transaction>,
    entityManager: EntityManager,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    return entityManager.save(Transaction, transaction);
  }

  public async update(transaction: Transaction, entityManager: EntityManager) {
    return entityManager.save(transaction);
  }

  public async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'amount', 'status'],
    });
  }

  public async findOne(
    userId: string,
    transactionId: string,
  ): Promise<TransactionViewDto> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
        user: { id: userId },
      },
      select: ['id', 'amount', 'status'],
    });
    if (!transaction) {
      throw new BadRequestException();
    }
    return transaction;
  }

  public async delete(transactionId: string): Promise<void> {
    await this.transactionRepository.softDelete(transactionId);
  }

  public async updateStatus(
    transactionId: string,
    status: TransactionStatus,
  ): Promise<void> {
    await this.transactionRepository.update(transactionId, { status });
  }
}
