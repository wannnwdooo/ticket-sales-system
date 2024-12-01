import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Не валидный email' })
  @Transform(({ value }) => value.toLowerCase())
  public readonly email!: string;

  @ApiProperty({ example: 'securePassword123!' })
  @IsNotEmpty()
  @IsString()
  public readonly password!: string;
}
