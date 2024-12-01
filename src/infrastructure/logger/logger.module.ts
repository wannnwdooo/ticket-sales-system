import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { Config, Environment } from '../config';

const pinoConfigsObj: Record<Environment, pino.LoggerOptions> = {
  development: {
    transport: {
      target: 'pino-pretty',
    },
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  production: {},
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        pinoHttp: {
          ...pinoConfigsObj[config.configEnv],
          level: config.logger.level,
        },
        forRoutes: ['*'],
      }),
    }),
  ],
})
export class LoggerModule {}
