import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './token.service';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): TokenPayload => {
    const req = ctx.switchToHttp().getRequest<{ user?: TokenPayload }>();
    return req.user as TokenPayload;
  },
);
