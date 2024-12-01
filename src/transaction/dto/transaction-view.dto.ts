import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TransactionStatus } from '../enums';

export class TransactionViewDto {
  @ApiProperty({ example: 'c58b67da-8379-4a20-8b67-da83790a20c3' })
  @Expose()
  @IsUUID()
  public id!: string;

  @ApiProperty({ example: 2500 })
  @Expose()
  @IsPositive()
  @IsNumber()
  public amount!: number;

  @ApiProperty({ example: TransactionStatus.SUCCESS })
  @Expose()
  @IsEnum(TransactionStatus)
  public status!: TransactionStatus;
}
