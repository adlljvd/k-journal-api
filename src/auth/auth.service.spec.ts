import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';
import { UserRepository } from '../modules/user/user.repository';
import { UserProfileRepository } from '../modules/user/user-profile.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorCode } from '../common/enums/error-code.enum';
import { Role } from '../common/enums/role.enum';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';

// Mock argon2
jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;

  let userRepository: jest.Mocked<UserRepository>;
  let prismaService: {
    $transaction: jest.Mock;
    user: { create: jest.Mock };
    userProfile: { create: jest.Mock };
    refreshToken: {
      create: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'test-uuid',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: null,
  };

  const mockUserWithProfile = {
    ...mockUser,
    profile: {
      userId: 'test-uuid',
      avatarUrl: null,
      bio: null,
      profileFavorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    // Create mocks
    const mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      findByIdWithProfile: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockProfileRepository = {
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    prismaService = {
      $transaction: jest.fn(),
      user: { create: jest.fn() },
      userProfile: { create: jest.fn() },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: UserProfileRepository, useValue: mockProfileRepository },
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    it('should create user with hashed password and return tokens', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      prismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof prismaService) => Promise<unknown>) => {
          return fn(prismaService);
        },
      );

      prismaService.user.create.mockResolvedValue(mockUser);
      prismaService.userProfile.create.mockResolvedValue({});
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBeDefined();
      expect(argon2.hash).toHaveBeenCalledWith(registerDto.password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });
    });

    it('should throw EMAIL_ALREADY_EXISTS when email is duplicate', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toMatchObject({
        response: { code: ErrorCode.EMAIL_ALREADY_EXISTS },
      });
    });

    it('should throw USERNAME_ALREADY_EXISTS when username is duplicate (case-insensitive)', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toMatchObject({
        response: { code: ErrorCode.USERNAME_ALREADY_EXISTS },
      });
    });

    it('should auto-create profile with defaults on registration', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      prismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof prismaService) => Promise<unknown>) => {
          return fn(prismaService);
        },
      );

      prismaService.user.create.mockResolvedValue(mockUser);
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      await service.register(registerDto);

      // Assert
      expect(prismaService.userProfile.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          avatarUrl: null,
          bio: null,
          profileFavorites: [],
        },
      });
    });

    it('should return tokens on successful registration', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      prismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof prismaService) => Promise<unknown>) => {
          return fn(prismaService);
        },
      );

      prismaService.user.create.mockResolvedValue(mockUser);
      prismaService.userProfile.create.mockResolvedValue({});
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should use argon2id algorithm for password hashing', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      prismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof prismaService) => Promise<unknown>) => {
          return fn(prismaService);
        },
      );

      prismaService.user.create.mockResolvedValue(mockUser);
      prismaService.userProfile.create.mockResolvedValue({});
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      await service.register(registerDto);

      // Assert
      expect(argon2.hash).toHaveBeenCalledWith(
        registerDto.password,
        expect.objectContaining({
          type: argon2.argon2id,
        }),
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return tokens and user with valid credentials', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw AUTH_INVALID_CREDENTIALS when email is invalid', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toMatchObject({
        response: { code: ErrorCode.AUTH_INVALID_CREDENTIALS },
      });
    });

    it('should throw AUTH_INVALID_CREDENTIALS when password is invalid', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toMatchObject({
        response: { code: ErrorCode.AUTH_INVALID_CREDENTIALS },
      });
    });

    it('should extend refresh token to 30 days when rememberMe is true', async () => {
      // Arrange
      const loginWithRemember: LoginDto = {
        ...loginDto,
        rememberMe: true,
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      await service.login(loginWithRemember);

      // Assert
      expect(prismaService.refreshToken.create).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          userId: mockUser.id,
        }),
      });

      // Check that expiresAt is approximately 30 days from now
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const createCall = prismaService.refreshToken.create.mock.calls[0][0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const expiresAt = createCall.data.expiresAt as Date;
      const daysDiff = Math.round(
        (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      expect(daysDiff).toBeGreaterThanOrEqual(29);
      expect(daysDiff).toBeLessThanOrEqual(31);
    });

    it('should set refresh token to 7 days when rememberMe is false', async () => {
      // Arrange
      const loginWithoutRemember: LoginDto = {
        ...loginDto,
        rememberMe: false,
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      await service.login(loginWithoutRemember);

      // Assert
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const createCall = prismaService.refreshToken.create.mock.calls[0][0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const expiresAt = createCall.data.expiresAt as Date;
      const daysDiff = Math.round(
        (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      expect(daysDiff).toBeGreaterThanOrEqual(6);
      expect(daysDiff).toBeLessThanOrEqual(8);
    });

    it('should generate access token that expires in 15 minutes', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findByIdWithProfile.mockResolvedValue(mockUserWithProfile);

      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-uuid',
        userId: mockUser.id,
        tokenHash: 'hashed-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('access-token');

      // Act
      await service.login(loginDto);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '15m',
        }),
      );
    });
  });

  describe('refreshTokens', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    const mockStoredToken = {
      id: 'token-uuid',
      userId: mockUser.id,
      tokenHash: 'hashed-token',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
      createdAt: new Date(),
      user: mockUser,
    };

    it('should return new access/refresh pair with valid refresh token', async () => {
      // Arrange
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-token');

      prismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
      prismaService.refreshToken.delete.mockResolvedValue(mockStoredToken);
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'new-token-uuid',
        userId: mockUser.id,
        tokenHash: 'new-hashed-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('new-access-token');

      // Act
      const result = await service.refreshTokens(refreshTokenDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw AUTH_TOKEN_INVALID when refresh token is invalid', async () => {
      // Arrange
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-token');
      prismaService.refreshToken.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(
        service.refreshTokens(refreshTokenDto),
      ).rejects.toMatchObject({
        response: { code: ErrorCode.AUTH_TOKEN_INVALID },
      });
    });

    it('should throw AUTH_TOKEN_EXPIRED when refresh token is expired', async () => {
      // Arrange
      const expiredToken = {
        ...mockStoredToken,
        expiresAt: new Date(Date.now() - 1000), // Expired
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-token');
      prismaService.refreshToken.findUnique.mockResolvedValue(expiredToken);
      prismaService.refreshToken.delete.mockResolvedValue(expiredToken);

      // Act & Assert
      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(
        service.refreshTokens(refreshTokenDto),
      ).rejects.toMatchObject({
        response: { code: ErrorCode.AUTH_TOKEN_EXPIRED },
      });
    });

    it('should invalidate old refresh token after refresh (rotation)', async () => {
      // Arrange
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-token');

      prismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
      prismaService.refreshToken.delete.mockResolvedValue(mockStoredToken);
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'new-token-uuid',
        userId: mockUser.id,
        tokenHash: 'new-hashed-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      jwtService.sign.mockReturnValue('new-access-token');

      // Act
      await service.refreshTokens(refreshTokenDto);

      // Assert
      expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: mockStoredToken.id },
      });
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token', async () => {
      // Arrange
      const token = 'valid-refresh-token';
      const expectedHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      await service.logout(token);

      // Assert
      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { tokenHash: expectedHash },
      });
    });
  });

  describe('token hashing', () => {
    it('should use SHA-256 algorithm', async () => {
      const token = 'test-token';
      const expectedHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const result = await (
        service as unknown as { hashToken: (p: string) => Promise<string> }
      ).hashToken(token);

      expect(result).toBe(expectedHash);
    });

    it('should produce different hashes for different tokens', async () => {
      // Arrange
      const token1 = 'token1';
      const token2 = 'token2';

      // Act
      const hash1 = await (
        service as unknown as { hashToken: (p: string) => Promise<string> }
      ).hashToken(token1);
      const hash2 = await (
        service as unknown as { hashToken: (p: string) => Promise<string> }
      ).hashToken(token2);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('forgotPassword', () => {
    it('should return generic message when user exists', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await service.forgotPassword({
        email: 'test@example.com',
      });

      // Assert
      expect(result.message).toBe(
        'If an account exists with this email, you will receive a reset link.',
      );
    });

    it('should return generic message when user does not exist (security)', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.forgotPassword({
        email: 'nonexistent@example.com',
      });

      // Assert - Same message to not reveal if email exists
      expect(result.message).toBe(
        'If an account exists with this email, you will receive a reset link.',
      );
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException with INVALID_TOKEN error', () => {
      // Act & Assert
      expect(() =>
        service.resetPassword({
          token: 'some-token',
          password: 'newPassword123',
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException with correct error code', () => {
      // Act & Assert
      expect(() =>
        service.resetPassword({
          token: 'some-token',
          password: 'newPassword123',
        }),
      ).toThrow('Invalid or expired reset token.');
    });
  });
});
