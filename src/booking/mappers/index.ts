import { plainToInstance } from 'class-transformer';
import { BookingViewDto } from '../dto';
import { Booking } from '../entities/booking.entity';

export function mapToViewBooking(booking: Booking): BookingViewDto {
  return plainToInstance(BookingViewDto, booking, {
    excludeExtraneousValues: true,
  });
}
