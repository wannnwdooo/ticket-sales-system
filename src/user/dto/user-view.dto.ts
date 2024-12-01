import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { Role } from '../../auth/enums';
import { BookingViewDto } from '../../booking/dto';
import { TransactionViewDto } from '../../transaction/dto';

export class UserViewDto {
  @ApiProperty({ example: '6c5a6df8-e716-4708-9a6d-f8e716c708db' })
  @Expose()
  public id!: string;

  @ApiProperty({ example: 'test@example.com' })
  @Expose()
  public email!: string;

  @ApiProperty({ example: Role.USER })
  @Expose()
  public role!: Role;

  @ApiProperty({ type: TransactionViewDto, isArray: true })
  @Expose()
  @ValidateNested()
  @Type(() => TransactionViewDto)
  public transactions!: TransactionViewDto[];

  @ApiProperty({ type: BookingViewDto, isArray: true })
  @Expose()
  @ValidateNested()
  @Type(() => BookingViewDto)
  public bookings!: BookingViewDto[];
}
