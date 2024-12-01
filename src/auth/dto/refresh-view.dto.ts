import { ApiProperty } from '@nestjs/swagger';

export class RefreshViewDto {
  @ApiProperty({ example: 'New pair of tokens issued' })
  public message!: string;
}
