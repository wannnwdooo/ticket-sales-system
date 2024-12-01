import { IsIP, IsInt, IsString, Min } from 'class-validator';
import { IsPort } from '../../../common/decorators';

export class HttpConfig {
  @IsPort()
  public readonly port!: number;

  @IsIP()
  public readonly host!: string;

  @IsString()
  public readonly swaggerServer!: string;

  @IsInt()
  @Min(0)
  public readonly defaultClientTimeout!: number;
}
