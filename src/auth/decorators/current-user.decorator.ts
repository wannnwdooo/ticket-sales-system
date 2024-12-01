import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayloadWithRt } from '../types';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadWithRt;
    if (!data) return user;
    return user[data];
  },
);
