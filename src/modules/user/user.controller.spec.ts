/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  ChangeEmailDto,
  DeleteAccountDto,
} from './dto';
import { Role } from '../../common/enums/role.enum';
import { ErrorCode } from '../../common/enums/error-code.enum';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserId = 'user-uuid-1234';

  const mockRequest = {
    user: {
      userId: mockUserId,
      email: 'test@example.com',
      role: Role.USER,
    },
  };

  const mockUser = {
    id: mockUserId,
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      userId: mockUserId,
      avatarUrl: null,
      bio: 'Test bio',
      profileFavorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as any;

  beforeEach(async () => {
    const mockUserService = {
      getCurrentUser: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      changeEmail: jest.fn(),
      deleteAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should return current user profile', async () => {
      // Arrange
      userService.getCurrentUser.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      // Act
      const result = await controller.getMe(mockRequest as any);

      // Assert
      expect(userService.getCurrentUser).toHaveBeenCalledWith(mockUserId);
      expect(result.id).toBe(mockUserId);
      expect(result.email).toBe('test@example.com');
    });

    it('should include profile data', async () => {
      // Arrange
      userService.getCurrentUser.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      // Act
      const result = await controller.getMe(mockRequest as any);

      // Assert
      expect(result.profile).toBeDefined();
      expect(result.profile!.bio).toBe('Test bio');
    });
  });

  describe('updateMe', () => {
    const updateDto: UpdateProfileDto = {
      bio: 'Updated bio',
    };

    it('should update user profile', async () => {
      // Arrange
      const updatedUser = {
        ...mockUser,
        profile: { ...mockUser.profile, bio: 'Updated bio' },
      };
      userService.updateProfile.mockResolvedValue({
        success: true,
        data: updatedUser,
      });

      // Act
      const result = await controller.updateMe(mockRequest as any, updateDto);

      // Assert
      expect(userService.updateProfile).toHaveBeenCalledWith(
        mockUserId,
        updateDto,
      );
      expect(result.profile!.bio).toBe('Updated bio');
    });

    it('should update avatar URL', async () => {
      // Arrange
      const avatarDto: UpdateProfileDto = {
        avatarUrl: 'https://example.com/avatar.jpg',
      };
      const updatedUser = {
        ...mockUser,
        profile: {
          ...mockUser.profile,
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      };
      userService.updateProfile.mockResolvedValue({
        success: true,
        data: updatedUser,
      });

      // Act
      const result = await controller.updateMe(mockRequest as any, avatarDto);

      // Assert
      expect(result.profile!.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should update profile favorites', async () => {
      // Arrange
      const favoritesDto: UpdateProfileDto = {
        profileFavorites: ['content-uuid-1', 'content-uuid-2'],
      };
      userService.updateProfile.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      // Act
      await controller.updateMe(mockRequest as any, favoritesDto);

      // Assert
      expect(userService.updateProfile).toHaveBeenCalledWith(
        mockUserId,
        favoritesDto,
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: 'oldpassword123',
      newPassword: 'newpassword456',
    };

    it('should change password successfully', async () => {
      // Arrange
      userService.changePassword.mockResolvedValue({
        success: true,
        data: undefined,
      });

      // Act
      await controller.changePassword(mockRequest as any, changePasswordDto);

      // Assert
      expect(userService.changePassword).toHaveBeenCalledWith(
        mockUserId,
        changePasswordDto,
      );
    });

    it('should throw error for incorrect current password', async () => {
      // Arrange
      userService.changePassword.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.INVALID_CURRENT_PASSWORD,
          message: 'Invalid current password',
        },
      });

      // Act & Assert
      await expect(
        controller.changePassword(mockRequest as any, changePasswordDto),
      ).rejects.toThrow();
    });
  });

  describe('changeEmail', () => {
    const changeEmailDto: ChangeEmailDto = {
      password: 'password123',
      newEmail: 'newemail@example.com',
    };

    it('should change email successfully', async () => {
      // Arrange
      userService.changeEmail.mockResolvedValue({
        success: true,
        data: undefined,
      });

      // Act
      await controller.changeEmail(mockRequest as any, changeEmailDto);

      // Assert
      expect(userService.changeEmail).toHaveBeenCalledWith(
        mockUserId,
        changeEmailDto,
      );
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      userService.changeEmail.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'Email already exists',
        },
      });

      // Act & Assert
      await expect(
        controller.changeEmail(mockRequest as any, changeEmailDto),
      ).rejects.toThrow();
    });
  });

  describe('deleteAccount', () => {
    const deleteAccountDto: DeleteAccountDto = {
      password: 'password123',
    };

    it('should delete account successfully', async () => {
      // Arrange
      userService.deleteAccount.mockResolvedValue({
        success: true,
        data: undefined,
      });

      // Act
      await controller.deleteAccount(mockRequest as any, deleteAccountDto);

      // Assert
      expect(userService.deleteAccount).toHaveBeenCalledWith(
        mockUserId,
        deleteAccountDto,
      );
    });

    it('should throw error for incorrect password', async () => {
      // Arrange
      userService.deleteAccount.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.INVALID_PASSWORD,
          message: 'Invalid password',
        },
      });

      // Act & Assert
      await expect(
        controller.deleteAccount(mockRequest as any, deleteAccountDto),
      ).rejects.toThrow();
    });
  });
});
