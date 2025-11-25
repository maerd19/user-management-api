import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
