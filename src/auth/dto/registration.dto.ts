import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Не валидный email' })
  @Transform(({ value }) => value.toLowerCase())
  public readonly email!: string;

  @ApiProperty({ example: 'securePassword123!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Минимальная длина пароля 8 символов' })
  public readonly password!: string;
}
