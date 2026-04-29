import { Injectable } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerException,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import type { ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import type { JwtUser } from './roles.guard';

/**
 * Custom throttler guard that:
 * - Applies global rate limit of 100 req/min per IP
 * - Skips rate limiting for admin users
 * - Includes rate limit headers in response
 */
@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    await Promise.resolve({ context, throttlerLimitDetail });
    throw new ThrottlerException('Too many requests. Please try again later.');
  }

  protected async getTracker(req: FastifyRequest): Promise<string> {
    // Use IP address as tracker
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : ((req.headers['x-real-ip'] as string) ?? req.ip ?? 'unknown');
    return await Promise.resolve(ip);
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user as JwtUser | undefined;

    // Skip rate limiting for admin users
    if (user && (user.role as string) === 'ADMIN') {
      return await Promise.resolve(true);
    }

    return await Promise.resolve(false);
  }
}
