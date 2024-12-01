import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: '3b734c11-da18-40ea-b34c-11da1880eaaa' })
  @IsNotEmpty()
  @IsUUID()
  public userId!: string;

  @ApiProperty({ example: '674417809f2fdc360348596e' })
  @IsNotEmpty()
  @IsMongoId()
  public eventId!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  public ticketsCount!: number;
}
