import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/enums';

export class AddRoleDto {
  @ApiProperty({ example: Role.ADMIN })
  @IsNotEmpty()
  @IsEnum(Role)
  public role!: Role;
}
