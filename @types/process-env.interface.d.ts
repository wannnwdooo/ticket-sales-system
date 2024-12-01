import { Options } from 'pino-http';

declare interface ProcessEnv extends Dict<string> {
  // common
  CONFIG_ENV: string;

  // postgres
  PG_WRITE_CONNECTION_STRING: string;
  PG_READ_CONNECTION_STRING: string;
  PG_CONNECTION_TIMEOUT: string;
  PG_POOL_SIZE: string;

  // mongo
  MONGODB_URI: string;

  // http
  HTTP_PORT: string;
  HTTP_HOST: string;
  SWAGGER_SERVER: string;
  HTTP_DEFAULT_CLIENT_TIMEOUT: string;

  // logger
  LOG_LEVEL: Options['useLevel'];

  // redis
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD: string;

  // typeorm
  TYPEORM_MIGRATIONS_TRANSACTION_MODE: 'all' | 'each' | undefined;

  // jwt secrets
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
}
