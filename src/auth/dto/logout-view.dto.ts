import { ApiProperty } from '@nestjs/swagger';

export class LogoutViewDto {
  @ApiProperty({ example: 'You have successfully logged out' })
  public message!: string;
}
