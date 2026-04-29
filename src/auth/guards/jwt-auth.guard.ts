import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: unknown, user: TUser, info: unknown): TUser {
    if (info instanceof Error && info.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_EXPIRED,
        message: 'Token has expired',
      });
    }
    if (err || !user) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_INVALID,
        message: 'Invalid token',
      });
    }
    return user;
  }
}
