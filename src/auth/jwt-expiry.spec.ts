/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('JWT Expiry', () => {
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '15m' },
        }),
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  it('should have an expiry of exactly 15 minutes (900 seconds)', () => {
    const payload = { sub: 'user-id', email: 'test@example.com', role: 'USER' };
    const token = jwtService.sign(payload);
    const decoded = jwtService.decode(token);

    if (decoded && typeof decoded === 'object' && !Array.isArray(decoded)) {
      const d = decoded as Record<string, unknown>;
      const iat = d.iat;
      const exp = d.exp;

      if (typeof iat === 'number' && typeof exp === 'number') {
        expect(exp - iat).toBe(900); // 15 minutes * 60 seconds
      } else {
        throw new Error('iat or exp is not a number');
      }
    } else {
      throw new Error('Decoded token is not an object');
    }
  });

  it('should contain correct payload fields', () => {
    const payload = { sub: 'user-id', email: 'test@example.com', role: 'USER' };
    const token = jwtService.sign(payload);
    const decoded = jwtService.decode(token);

    if (decoded && typeof decoded === 'object' && !Array.isArray(decoded)) {
      const d = decoded as Record<string, unknown>;
      expect(d.sub).toBe(payload.sub);
      expect(d.email).toBe(payload.email);
      expect(d.role).toBe(payload.role);
      expect(d.iat).toBeDefined();
      expect(d.exp).toBeDefined();
    } else {
      throw new Error('Decoded token is not an object');
    }
  });
});
