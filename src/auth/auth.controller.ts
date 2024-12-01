import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserViewDto } from '../user/dto';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { CurrentUser, CurrentUserId, Public } from './decorators';
import {
  LoginDto,
  LogoutViewDto,
  RefreshViewDto,
  RegistrationDto,
  RegistrationViewDto,
} from './dto';
import { RefreshGuard } from './guards';
import { Tokens } from './types';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  @ApiResponse({ type: RegistrationViewDto, status: HttpStatus.CREATED })
  public async registration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<RegistrationViewDto> {
    await this.authService.registration(registrationDto);
    return {
      message: 'You have successfully registered. Now you can log in',
    };
  }

  @Public()
  @Post('login')
  @ApiResponse({ type: UserViewDto, status: HttpStatus.CREATED })
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserViewDto> {
    const { tokens, user } = await this.authService.login(loginDto);
    this.setTokensInCookies(tokens, res);
    return user;
  }

  @Get('logout')
  @ApiOkResponse({ type: LogoutViewDto })
  public async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUserId() id: string,
  ): Promise<LogoutViewDto> {
    await this.authService.logout(id);
    this.clearCookies(res);
    return { message: 'You have successfully logged out' };
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Get('refresh')
  @ApiOkResponse({ type: RefreshViewDto })
  public async refresh(
    @CurrentUser(REFRESH_TOKEN) refreshToken: string,
    @CurrentUserId() id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshViewDto> {
    const tokens = await this.authService.refresh(refreshToken, id);
    this.setTokensInCookies(tokens, res);
    return { message: 'New pair of tokens issued' };
  }

  private setTokensInCookies(tokens: Tokens, res: Response): void {
    res.cookie(ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      path: '**/auth/refresh',
      sameSite: 'lax',
    });
  }

  private clearCookies(res: Response): void {
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN, { path: '**/auth/refresh' });
  }
}
