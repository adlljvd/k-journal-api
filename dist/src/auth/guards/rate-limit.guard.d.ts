import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import type { ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
export declare class RateLimitGuard extends ThrottlerGuard {
    protected throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void>;
    protected getTracker(req: FastifyRequest): Promise<string>;
    protected shouldSkip(context: ExecutionContext): Promise<boolean>;
}
