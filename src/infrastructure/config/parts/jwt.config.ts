import { IsString } from 'class-validator';

export class JwtConfig {
  @IsString()
  public readonly access!: string;

  @IsString()
  public readonly refresh!: string;
}
