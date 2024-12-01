import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { TransactionViewDto } from '../../transaction/dto';

export class BookingViewDto {
  @ApiProperty({ example: '5c90a555-946a-4600-90a5-55946af600c7' })
  @Expose()
  @IsUUID()
  public id!: string;

  @ApiProperty({ example: '674417809f2fdc360348596e' })
  @Expose()
  @IsMongoId()
  public eventId!: string;

  @ApiProperty({ example: 2 })
  @Expose()
  @IsPositive()
  @IsInt()
  public ticketsCount!: number;

  @ApiProperty({ example: 2500 })
  @Expose()
  @IsPositive()
  @IsNumber()
  public totalPrice!: number;

  @ApiProperty({ type: TransactionViewDto })
  @Expose()
  @ValidateNested()
  @Type(() => TransactionViewDto)
  public transaction!: TransactionViewDto;
}
