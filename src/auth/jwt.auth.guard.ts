import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class jwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const cookieToken = ctx.req.headers.cookie
      .split('; ')
      .find((e) => e.includes('token'))
      .split('=')[1];
    if (!cookieToken) {
      // if (!ctx.req.headers.authorization || !cookieToken) {
      return false;
    }
    ctx.user = await this.validateToken(cookieToken);
    return true;
  }

  async validateToken(authToken: string) {
    if (!authToken) {
      throw new UnauthorizedException();
    }
    try {
      const user = this.jwtService.verify(authToken);
      if (user) {
        return user;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  // async validateToken(authToken: string) {
  //   const bearer = authToken.split(' ')[0];
  //   const token = authToken.split(' ')[1];
  //   if (bearer !== 'Bearer' || !token) {
  //     throw new UnauthorizedException();
  //   }
  //   try {
  //     const user = this.jwtService.verify(token);
  //     if (user) {
  //       return user;
  //     }
  //   } catch (e) {
  //     throw new UnauthorizedException();
  //   }
  // }
}
