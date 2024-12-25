import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/types/jwt-payload";

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload | null => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return null
    return request.user.sub;
  }
)