import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { EventCategory } from '../enums';

export class CreateEventDto {
  @ApiProperty({ example: 'Title example' })
  @IsNotEmpty()
  @IsString()
  public title!: string;

  @ApiProperty({ example: 'Description example' })
  @IsNotEmpty()
  @IsString()
  public description!: string;

  @ApiProperty({ example: '2024-11-30T18:09:13.988Z' })
  @IsNotEmpty()
  @IsISO8601()
  public date!: string;

  @ApiProperty({ example: 'Venue example' })
  @IsNotEmpty()
  @IsString()
  public venue!: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public ticketsAvailable!: number;

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public price!: number;

  @ApiProperty({ example: EventCategory.CINEMA })
  @IsNotEmpty()
  @IsEnum(EventCategory)
  public category!: EventCategory;
}
