/**
 * Tests for guards/index.ts exports
 * This file ensures 100% coverage for the barrel exports
 */
import { RolesGuard, RateLimitGuard } from './index';

describe('Guards Index Exports', () => {
  it('should export RolesGuard', () => {
    expect(RolesGuard).toBeDefined();
    expect(RolesGuard.name).toBe('RolesGuard');
  });

  it('should export RateLimitGuard', () => {
    expect(RateLimitGuard).toBeDefined();
    expect(RateLimitGuard.name).toBe('RateLimitGuard');
  });
});
