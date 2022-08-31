import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { UserInfo} from '../decorators/user.decorator';

declare global {
  namespace Express {
    interface Request {
      user?: UserInfo
    }
  }
}

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request?.headers?.authorization?.split('Bearer ')?.[1];
    const user = jwt.decode(token) as UserInfo;
    request.user = user;

    return next.handle();
  }
}