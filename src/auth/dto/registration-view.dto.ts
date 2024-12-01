import { ApiProperty } from '@nestjs/swagger';

export class RegistrationViewDto {
  @ApiProperty({
    example: 'You have successfully registered. Now you can log in',
  })
  public message!: string;
}
