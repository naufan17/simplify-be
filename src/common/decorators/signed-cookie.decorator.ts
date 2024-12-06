import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const SignedCookie = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.signedCookies[data] || null;
  },
);