import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config } from '../../infrastructure/config';
import { REFRESH_TOKEN } from '../constants';
import { JwtPayload, JwtPayloadWithRt } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly config: Config) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies[REFRESH_TOKEN],
      ]),
      secretOrKey: config.jwt.refresh,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.cookies[REFRESH_TOKEN];

    if (!refreshToken) throw new ForbiddenException();

    return {
      ...payload,
      refreshToken,
    };
  }
}
