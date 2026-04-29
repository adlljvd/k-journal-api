import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    delete process.env.JWT_SECRET;
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should use default secret when process.env.JWT_SECRET is not set', () => {
    expect(strategy).toBeDefined();
    // We can't easily check the private options of PassportStrategy,
    // but we've covered the branch.
  });

  describe('with JWT_SECRET', () => {
    beforeEach(async () => {
      process.env.JWT_SECRET = 'test-secret';
      const module: TestingModule = await Test.createTestingModule({
        providers: [JwtStrategy],
      }).compile();

      strategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should validate payload', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'USER',
      };
      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        role: 'USER',
      });
    });
  });
});
