import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest(); // ctx값: authTest(@Req9() req) 의 req 값과 동일
    return req.user; //  
  },
);
