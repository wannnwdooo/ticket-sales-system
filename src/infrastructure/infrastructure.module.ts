import { Module, OnApplicationShutdown } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PinoLogger } from 'nestjs-pino';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { LoggerModule } from './logger/logger.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    DatabaseModule,
    RedisModule,
    JwtModule.register({ global: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    ExceptionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class InfrastructureModule implements OnApplicationShutdown {
  public constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(this.constructor.name);
  }

  public onApplicationShutdown(signal?: string): void {
    this.logger.info(`Received shutdown signal: ${signal}`);
  }
}
