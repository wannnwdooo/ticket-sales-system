import { Type } from 'class-transformer';
import { IsDefined, IsEnum, ValidateNested } from 'class-validator';

import { Environment } from './enums';
import {
  HttpConfig,
  JwtConfig,
  LoggerConfig,
  MongoConfig,
  PgConfig,
  RedisConfig,
} from './parts';

export class Config {
  @IsEnum(Environment)
  public readonly configEnv!: Environment;

  @Type(() => PgConfig)
  @IsDefined()
  @ValidateNested()
  public readonly pg!: PgConfig;

  @Type(() => MongoConfig)
  @IsDefined()
  @ValidateNested()
  public readonly mongo!: MongoConfig;

  @Type(() => HttpConfig)
  @IsDefined()
  @ValidateNested()
  public readonly http!: HttpConfig;

  @Type(() => LoggerConfig)
  @IsDefined()
  @ValidateNested()
  public readonly logger!: LoggerConfig;

  @Type(() => RedisConfig)
  @IsDefined()
  @ValidateNested()
  public readonly redis!: RedisConfig;

  @Type(() => JwtConfig)
  @IsDefined()
  @ValidateNested()
  public readonly jwt!: JwtConfig;
}
