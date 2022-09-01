import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from '../user/decorators/user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // This can be written way better
    if (roles?.length) {
      const request = context.switchToHttp().getRequest() as Request;
      const token = request.headers?.authorization?.split('Bearer ')[1];

      try {
        const payload = jwt.verify(token, process.env.JSON_TOKEN_KEY) as UserInfo;
        
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id }
        })

        if (!user) return false;
        
        if (roles.includes(user.user_type)) {
          return true
        }
        return false
      } catch (err) {
        return false;
      }
    }

    return true;
  }
}