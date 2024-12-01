import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { RolesGuard } from '../auth/guards';
import { AddRoleDto, UserViewDto } from './dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOkResponse({ type: UserViewDto, isArray: true })
  public async getUsers(): Promise<UserViewDto[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiOkResponse({ type: UserViewDto })
  public async getUser(@Param('userId') userId: string): Promise<UserViewDto> {
    return this.userService.findOneById(userId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':userId/set-role')
  @ApiOkResponse({ type: UserViewDto })
  public async setRole(
    @Body() body: AddRoleDto,
    @Param('userId') userId: string,
  ): Promise<UserViewDto> {
    return this.userService.setRole(body, userId);
  }
}
