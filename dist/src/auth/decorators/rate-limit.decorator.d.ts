import type { ThrottlerOptions } from '@nestjs/throttler';
export declare const RATE_LIMIT_KEY = "throttle";
export declare const RateLimit: (options: ThrottlerOptions, key?: string) => import("@nestjs/common").CustomDecorator<string>;
