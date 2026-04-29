"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
let RateLimitGuard = class RateLimitGuard extends throttler_1.ThrottlerGuard {
    async throwThrottlingException(context, throttlerLimitDetail) {
        await Promise.resolve({ context, throttlerLimitDetail });
        throw new throttler_1.ThrottlerException('Too many requests. Please try again later.');
    }
    async getTracker(req) {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string'
            ? forwarded.split(',')[0].trim()
            : (req.headers['x-real-ip'] ?? req.ip ?? 'unknown');
        return await Promise.resolve(ip);
    }
    async shouldSkip(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && user.role === 'ADMIN') {
            return await Promise.resolve(true);
        }
        return await Promise.resolve(false);
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)()
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map