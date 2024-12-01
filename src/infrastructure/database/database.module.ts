import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config, PgConfig } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [PgConfig],
      useFactory: (config: PgConfig) => ({
        database: 'postgres',
        type: 'postgres',
        synchronize: true,
        autoLoadEntities: true,
        logging: 'all',
        logger: 'debug',
        extra: {
          max: config.poolSize,
        },
        replication: {
          master: {
            url: config.writeConnectionString,
          },
          slaves: [
            {
              url: config.readConnectionString,
            },
          ],
        },
        connectTimeoutMS: config.connectionTimeout,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        uri: config.mongo.uri,
      }),
    }),
  ],
})
export class DatabaseModule {}
