import { IsString } from 'class-validator';

export class MongoConfig {
  @IsString()
  public readonly uri!: string;
}
