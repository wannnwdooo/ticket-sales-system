import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsPositive,
  IsString,
} from 'class-validator';
import { EventCategory } from '../enums';

export class EventViewDto {
  @ApiProperty({ example: '674417809f2fdc360348596e' })
  @Expose()
  @IsMongoId()
  @Type(() => String)
  public _id!: string;

  @ApiProperty({ example: 'Title example' })
  @Expose()
  @IsString()
  public title!: string;

  @ApiProperty({ example: 'Description example' })
  @Expose()
  @IsString()
  public description!: string;

  @ApiProperty({ example: '2024-11-30T18:09:13.988Z' })
  @Expose()
  @IsDate()
  public date!: Date;

  @ApiProperty({ example: 'Venue example' })
  @Expose()
  @IsString()
  public venue!: string;

  @ApiProperty({ example: 100 })
  @Expose()
  @IsInt()
  @IsPositive()
  public ticketsAvailable!: number;

  @ApiProperty({ example: 500 })
  @Expose()
  @IsInt()
  @IsPositive()
  public price!: number;

  @ApiProperty({ example: EventCategory.CINEMA })
  @Expose()
  @IsEnum(EventCategory)
  public category!: EventCategory;
}
