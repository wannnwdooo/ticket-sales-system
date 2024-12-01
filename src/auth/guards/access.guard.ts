import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { PUBLIC_KEY } from '../constants';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }

  override handleRequest<JwtPayload>(err: unknown, user: JwtPayload) {
    if (err || !user) {
      throw (
        err ||
        new HttpException('You are not logged in', HttpStatus.UNAUTHORIZED)
      );
    }
    return user;
  }
}
