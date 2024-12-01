import * as process from 'node:process';
import 'dotenv/config';
import { Config } from './config';
import { Environment, LogLevel } from './enums';

export const plainConfig: Config = {
  configEnv: process.env.CONFIG_ENV as Environment,
  pg: {
    writeConnectionString: process.env.PG_WRITE_CONNECTION_STRING as string,
    readConnectionString: process.env.PG_READ_CONNECTION_STRING as string,
    connectionTimeout: Number(process.env.PG_CONNECTION_TIMEOUT),
    poolSize: Number(process.env.PG_POOL_SIZE),
  },
  mongo: {
    uri: process.env.MONGODB_URI
  },
  http: {
    port: Number(process.env.HTTP_PORT),
    host: process.env.HTTP_HOST,
    swaggerServer: process.env.SWAGGER_SERVER,
    defaultClientTimeout: Number(process.env.HTTP_DEFAULT_CLIENT_TIMEOUT),
  },
  logger: {
    level: (process.env.LOG_LEVEL) as LogLevel,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
  }
};
