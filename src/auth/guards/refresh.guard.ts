import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  override handleRequest<JwtPayloadWithRt>(
    err: unknown,
    user: JwtPayloadWithRt,
  ) {
    if (err || !user) {
      throw (
        err ||
        new HttpException('You are not logged in', HttpStatus.UNAUTHORIZED)
      );
    }
    return user;
  }
}
