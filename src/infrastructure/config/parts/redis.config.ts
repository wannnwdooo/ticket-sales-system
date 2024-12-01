import { IsString } from 'class-validator';
import { IsPort } from '../../../common/decorators';

export class RedisConfig {
  @IsString()
  public readonly host!: string;

  @IsPort()
  public readonly port!: number;

  @IsString()
  public readonly password!: string;
}
