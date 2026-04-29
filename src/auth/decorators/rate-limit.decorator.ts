import { SetMetadata } from '@nestjs/common';
import type { ThrottlerOptions } from '@nestjs/throttler';

export const RATE_LIMIT_KEY = 'throttle';
export const RateLimit = (options: ThrottlerOptions, key?: string) =>
  SetMetadata(RATE_LIMIT_KEY, { ...options, key });
