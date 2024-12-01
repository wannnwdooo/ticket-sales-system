import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessGuard } from './auth/guards';
import { BookingModule } from './booking/booking.module';
import { EventModule } from './event/event.module';
import { routes } from './routes';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';

@Module({})
export class AppModule {
  static async register(): Promise<DynamicModule> {
    const { InfrastructureModule } = await import(
      './infrastructure/infrastructure.module'
    );

    return {
      module: AppModule,
      imports: [
        InfrastructureModule,
        EventModule,
        BookingModule,
        TransactionModule,
        AuthModule,
        UserModule,
        RouterModule.register(routes),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AccessGuard,
        },
      ],
    };
  }
}
