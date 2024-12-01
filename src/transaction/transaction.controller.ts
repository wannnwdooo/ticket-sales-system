import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TransactionViewDto } from './dto';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':userId')
  @ApiOkResponse({ type: TransactionViewDto, isArray: true })
  public async findAll(
    @Param('userId') userId: string,
  ): Promise<TransactionViewDto[]> {
    return this.transactionService.findAll(userId);
  }

  @Get(':transactionId/:userId')
  @ApiOkResponse({ type: TransactionViewDto })
  public async findOne(
    @Param('userId') userId: string,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionViewDto> {
    return this.transactionService.findOne(userId, transactionId);
  }
}
