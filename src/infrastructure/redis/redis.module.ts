import { Module } from '@nestjs/common';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';
import { Config, RedisConnectionName } from '../config';

@Module({
  imports: [
    IoRedisModule.forRootAsync({
      useFactory: (config: Config) => ({
        type: 'single',
        options: {
          connectionName: RedisConnectionName.default,
          host: config.redis.host,
          port: Number(config.redis.port),
          password: config.redis.password,
        },
      }),
      inject: [Config],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RedisModule {}
