import { PickType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PickType(CreateBookingDto, [
  'ticketsCount',
]) {}
