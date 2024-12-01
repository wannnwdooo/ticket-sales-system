import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from '../event/event.module';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    EventModule,
    TransactionModule,
    UserModule,
    TypeOrmModule.forFeature([Booking]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
