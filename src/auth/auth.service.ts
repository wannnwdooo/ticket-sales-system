import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Config } from '../infrastructure/config';
import { UserViewDto } from '../user/dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { compareEncryptedData, encryptingData } from '../utils';
import { LoginDto, RegistrationDto } from './dto';
import { Role } from './enums';
import { mapToViewLogin } from './mappers';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: Config,
  ) {}

  public async registration({
    email,
    password,
  }: RegistrationDto): Promise<void> {
    await this.userService.create({
      email,
      password: encryptingData(password),
    });
  }

  public async login({
    email,
    password,
  }: LoginDto): Promise<{ tokens: Tokens; user: UserViewDto }> {
    const user = await this.userService.findOneByEmail(email);

    const passwordMatches: boolean = compareEncryptedData(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_FOUND);
    }
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user, tokens.refreshToken);

    return {
      tokens,
      user: mapToViewLogin(user),
    };
  }

  public async logout(id: string): Promise<void> {
    const user = await this.userService.findOneById(id);
    if (!user.refreshToken) {
      throw new HttpException(
        'User is not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
    user.refreshToken = '';
    await this.userService.update(user);
  }

  public async refresh(id: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findOneById(id);
    if (!user.refreshToken) {
      throw new HttpException(
        'User is not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const refreshTokenMatches: boolean = compareEncryptedData(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new HttpException(
        'User is not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = await this.generateTokens(id, user.email, user.role);
    await this.updateRefreshTokenHash(user, tokens.refreshToken);
    return tokens;
  }

  private async updateRefreshTokenHash(
    user: User,
    refreshToken: string,
  ): Promise<void> {
    user.refreshToken = encryptingData(refreshToken);
    await this.userService.update(user);
  }

  private async generateTokens(
    id: string,
    email: string,
    role?: Role,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id,
      email,
      role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken(jwtPayload, '15m', this.config.jwt.access),
      this.createToken(jwtPayload, '7d', this.config.jwt.refresh),
    ]);

    return { accessToken, refreshToken };
  }

  private async createToken(
    payload: JwtPayload,
    time: string,
    secret: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: time,
    });
  }
}
