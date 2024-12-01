import { Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { EventModule } from './event/event.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  { path: 'users', module: UserModule },
  { path: 'auth', module: AuthModule },
  { path: 'events', module: EventModule },
  { path: 'bookings', module: BookingModule },
  { path: 'transactions', module: TransactionModule },
];
