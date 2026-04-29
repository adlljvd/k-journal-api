import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ErrorCode } from '../../common/enums/error-code.enum';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should return user when authentication is successful', () => {
      const user = { id: 'user-id', email: 'test@example.com' };
      const result = guard.handleRequest(null, user, null);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when info is TokenExpiredError', () => {
      const info = new Error('jwt expired');
      info.name = 'TokenExpiredError';

      expect(() => guard.handleRequest(null, null, info)).toThrow(
        new UnauthorizedException({
          code: ErrorCode.AUTH_TOKEN_EXPIRED,
          message: 'Token has expired',
        }),
      );
    });

    it('should throw UnauthorizedException when err is provided', () => {
      const err = new Error('Some error');
      expect(() => guard.handleRequest(err, null, null)).toThrow(
        new UnauthorizedException({
          code: ErrorCode.AUTH_TOKEN_INVALID,
          message: 'Invalid token',
        }),
      );
    });

    it('should throw UnauthorizedException when user is not provided', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        new UnauthorizedException({
          code: ErrorCode.AUTH_TOKEN_INVALID,
          message: 'Invalid token',
        }),
      );
    });
  });
});
