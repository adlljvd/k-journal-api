/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { Role } from '../common/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 'test-uuid',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      userId: 'test-uuid',
      avatarUrl: null,
      bio: null,
      profileFavorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refreshTokens: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    it('should register a new user and return user with tokens', async () => {
      // Arrange
      authService.register.mockResolvedValue({
        user: mockUser,
        ...mockTokens,
      });

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should return user object without password hash', async () => {
      // Arrange
      const userWithoutHash = { ...mockUser } as any;
      delete userWithoutHash.passwordHash;
      authService.register.mockResolvedValue({
        user: userWithoutHash,
        ...mockTokens,
      });

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result.user).toBeDefined();
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user and return user with tokens', async () => {
      // Arrange
      authService.login.mockResolvedValue({
        user: mockUser,
        ...mockTokens,
      });

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should login with rememberMe option', async () => {
      // Arrange
      const loginWithRemember: LoginDto = {
        ...loginDto,
        rememberMe: true,
      };

      authService.login.mockResolvedValue({
        user: mockUser,
        ...mockTokens,
      });

      // Act
      const result = await controller.login(loginWithRemember);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginWithRemember);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should logout user with refresh token', async () => {
      // Arrange
      authService.logout.mockResolvedValue(undefined);

      // Act
      const result = await controller.logout({ refreshToken: 'refresh-token' });

      // Assert
      expect(authService.logout).toHaveBeenCalledWith('refresh-token');
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should logout user without refresh token', async () => {
      // Act
      const result = await controller.logout({});

      // Assert
      expect(authService.logout).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should handle undefined refreshToken', async () => {
      // Act
      const result = await controller.logout({ refreshToken: undefined });

      // Assert
      expect(authService.logout).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('refresh', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should refresh tokens and return new tokens', async () => {
      // Arrange
      authService.refreshTokens.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      // Act
      const result = await controller.refresh(refreshTokenDto);

      // Assert
      expect(authService.refreshTokens).toHaveBeenCalledWith(refreshTokenDto);
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('should request password reset and return success message', async () => {
      // Arrange
      authService.forgotPassword.mockResolvedValue({
        message:
          'If an account exists with this email, you will receive a reset link.',
      });

      // Act
      const result = await controller.forgotPassword(forgotPasswordDto);

      // Assert
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
      expect(result).toEqual({
        message:
          'If an account exists with this email, you will receive a reset link.',
      });
    });

    it('should return generic message for non-existing email', async () => {
      // Arrange
      authService.forgotPassword.mockResolvedValue({
        message:
          'If an account exists with this email, you will receive a reset link.',
      });

      // Act
      const result = await controller.forgotPassword({
        email: 'nonexistent@example.com',
      });

      // Assert - Same message for security
      expect(result.message).toBe(
        'If an account exists with this email, you will receive a reset link.',
      );
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'reset-token',
      password: 'newpassword123',
    };

    it('should reset password and return success message', async () => {
      // Arrange
      authService.resetPassword.mockResolvedValue({
        message: 'Password has been reset successfully.',
      });

      // Act
      const result = await controller.resetPassword(resetPasswordDto);

      // Assert
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual({
        message: 'Password has been reset successfully.',
      });
    });
  });
});
