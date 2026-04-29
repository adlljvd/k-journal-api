import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Role } from '../../common/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  interface MockUser {
    userId: string;
    email: string;
    role: Role;
  }

  const createMockExecutionContext = (user: MockUser | undefined): unknown => {
    const mockRequest = { user };
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    describe('when no roles are required', () => {
      it('should allow access when requiredRoles is undefined', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'test@example.com',
          role: Role.USER,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });

      it('should allow access when requiredRoles is an empty array', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'test@example.com',
          role: Role.USER,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });

      it('should allow access when requiredRoles is null', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'test@example.com',
          role: Role.USER,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });
    });

    describe('when user is missing', () => {
      it('should throw ForbiddenException when user is not present', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.ADMIN]);

        const context = createMockExecutionContext(undefined);

        expect(() => guard.canActivate(context as never)).toThrow(
          ForbiddenException,
        );
      });

      it('should throw ForbiddenException with FORBIDDEN code when user is missing', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.ADMIN]);

        const context = createMockExecutionContext(undefined);

        try {
          guard.canActivate(context as never);
          fail('Expected ForbiddenException to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
          const exception = error as ForbiddenException;
          expect(exception.getResponse()).toEqual({
            code: 'FORBIDDEN',
            message: 'Access denied. Authentication required.',
          });
        }
      });
    });

    describe('when user has required role', () => {
      it('should allow access when user has required ADMIN role', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.ADMIN]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'admin@example.com',
          role: Role.ADMIN,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });

      it('should allow access when user has required USER role', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.USER]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'user@example.com',
          role: Role.USER,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });
    });

    describe('when user lacks required role', () => {
      it('should deny access when USER tries to access ADMIN-only endpoint', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.ADMIN]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'user@example.com',
          role: Role.USER,
        });

        expect(() => guard.canActivate(context as never)).toThrow(
          ForbiddenException,
        );
      });

      it('should throw ForbiddenException with ADMIN_ONLY code when user lacks admin role', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.ADMIN]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'user@example.com',
          role: Role.USER,
        });

        try {
          guard.canActivate(context as never);
          fail('Expected ForbiddenException to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
          const exception = error as ForbiddenException;
          expect(exception.getResponse()).toEqual({
            code: 'ADMIN_ONLY',
            message: 'Access denied. Admin privileges required.',
          });
        }
      });
    });

    describe('when multiple roles are required', () => {
      it('should allow access when user has one of multiple required roles', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.USER, Role.ADMIN]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'user@example.com',
          role: Role.USER,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });

      it('should allow access when user has ADMIN role among multiple required roles', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.USER, Role.ADMIN]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'admin@example.com',
          role: Role.ADMIN,
        });

        const result = guard.canActivate(context as never);
        expect(result).toBe(true);
      });

      it('should deny access when user has none of the required roles', () => {
        jest
          .spyOn(reflector, 'getAllAndOverride')
          .mockReturnValue([Role.ADMIN]);

        const context = createMockExecutionContext({
          userId: '123',
          email: 'user@example.com',
          role: Role.USER,
        });

        expect(() => guard.canActivate(context as never)).toThrow(
          ForbiddenException,
        );
      });
    });
  });

  describe('direct instantiation', () => {
    it('should create guard with direct instantiation', () => {
      const mockReflector = {
        getAllAndOverride: jest.fn().mockReturnValue(undefined),
      } as unknown as Reflector;

      const directGuard = new RolesGuard(mockReflector);
      expect(directGuard).toBeDefined();
      expect(directGuard).toBeInstanceOf(RolesGuard);
    });

    it('should work with directly instantiated guard', () => {
      const mockReflector = {
        getAllAndOverride: jest.fn().mockReturnValue([Role.USER]),
      } as unknown as Reflector;

      const directGuard = new RolesGuard(mockReflector);
      const context = createMockExecutionContext({
        userId: '123',
        email: 'user@example.com',
        role: Role.USER,
      });

      const result = directGuard.canActivate(context as never);
      expect(result).toBe(true);
    });
  });
});
