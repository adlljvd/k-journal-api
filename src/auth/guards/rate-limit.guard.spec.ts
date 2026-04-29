import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import {
  ThrottlerModule,
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';
import { RateLimitGuard } from './rate-limit.guard';
import { Role } from '../../common/enums/role.enum';

/**
 * RateLimitGuard testable subclass with public test methods
 * This is the standard pattern for testing protected methods in NestJS
 */
class RateLimitGuardTestable extends RateLimitGuard {
  public async testShouldSkip(context: ExecutionContext): Promise<boolean> {
    return this.shouldSkip(context);
  }

  public testGetTracker(req: unknown): Promise<string> {
    return this.getTracker(req as FastifyRequest);
  }

  public testThrowThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    return this.throwThrottlingException(
      context,
      {} as unknown as ThrottlerLimitDetail,
    );
  }
}

describe('RateLimitGuard', () => {
  let guard: RateLimitGuardTestable;

  interface MockUser {
    userId: string;
    email: string;
    role: Role;
  }

  const createMockExecutionContext = (
    user?: MockUser,
    ip?: string,
  ): ExecutionContext => {
    const mockRequest = {
      user,
      headers: {
        'x-forwarded-for': ip,
        'x-real-ip': ip,
      },
      ip: '127.0.0.1',
    };
    const mockResponse = {
      setHeader: jest.fn(),
    };
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 100 }]),
      ],
      providers: [RateLimitGuardTestable],
    }).compile();

    guard = module.get<RateLimitGuardTestable>(RateLimitGuardTestable);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('guard instantiation', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should extend ThrottlerGuard', () => {
      expect(guard).toBeInstanceOf(ThrottlerGuard);
    });
  });

  describe('shouldSkip method', () => {
    it('should skip rate limiting for admin users', async () => {
      const context = createMockExecutionContext(
        { userId: '123', email: 'admin@example.com', role: Role.ADMIN },
        '192.168.1.1',
      );

      const result = await guard.testShouldSkip(context);

      expect(result).toBe(true);
    });

    it('should not skip rate limiting for regular users', async () => {
      const context = createMockExecutionContext(
        { userId: '123', email: 'user@example.com', role: Role.USER },
        '192.168.1.1',
      );

      const result = await guard.testShouldSkip(context);

      expect(result).toBe(false);
    });

    it('should not skip rate limiting for unauthenticated users', async () => {
      const context = createMockExecutionContext(undefined, '192.168.1.1');

      const result = await guard.testShouldSkip(context);

      expect(result).toBe(false);
    });
  });

  describe('getTracker method', () => {
    it('should track requests by IP from x-forwarded-for header', async () => {
      const ip = '192.168.1.1';
      const request = {
        headers: {
          'x-forwarded-for': ip,
        },
        ip: '127.0.0.1',
      };

      const tracker = await guard.testGetTracker(request);

      expect(tracker).toBe(ip);
    });

    it('should track requests by first IP in x-forwarded-for list', async () => {
      const ipList = '192.168.1.1, 10.0.0.1, 172.16.0.1';
      const request = {
        headers: {
          'x-forwarded-for': ipList,
        },
        ip: '127.0.0.1',
      };

      const tracker = await guard.testGetTracker(request);

      expect(tracker).toBe('192.168.1.1');
    });

    it('should track requests by IP from x-real-ip header', async () => {
      const ip = '10.0.0.1';
      const request = {
        headers: {
          'x-real-ip': ip,
        },
        ip: '127.0.0.1',
      };

      const tracker = await guard.testGetTracker(request);

      expect(tracker).toBe(ip);
    });

    it('should return request ip as fallback', async () => {
      const request = {
        headers: {},
        ip: '127.0.0.1',
      };

      const tracker = await guard.testGetTracker(request);

      expect(tracker).toBe('127.0.0.1');
    });

    it('should return "unknown" as final fallback', async () => {
      const request = {
        headers: {},
      };

      const tracker = await guard.testGetTracker(request);

      expect(tracker).toBe('unknown');
    });
  });

  describe('throwThrottlingException method', () => {
    it('should throw ThrottlerException with message', async () => {
      const context = createMockExecutionContext(undefined);

      await expect(guard.testThrowThrottlingException(context)).rejects.toThrow(
        ThrottlerException,
      );
      await expect(guard.testThrowThrottlingException(context)).rejects.toThrow(
        'Too many requests. Please try again later.',
      );
    });
  });
});
