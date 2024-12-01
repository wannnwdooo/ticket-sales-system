import { IsEnum } from 'class-validator';

import { LogLevel } from '../enums';

export class LoggerConfig {
  @IsEnum(LogLevel)
  public readonly level!: LogLevel;
}
