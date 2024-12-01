import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config } from 'src/infrastructure/config';
import { UserService } from '../../user/user.service';
import { ACCESS_TOKEN } from '../constants';
import { JwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private config: Config,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies[ACCESS_TOKEN],
      ]),
      secretOrKey: config.jwt.access,
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;
    const { refreshToken } = await this.userService.findOneByEmail(email);
    if (!refreshToken) throw new UnauthorizedException();
    return payload;
  }
}
