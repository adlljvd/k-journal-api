/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserProfileRepository } from './user-profile.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { UserPrismaPayload } from './entities/user.entity';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let profileRepository: jest.Mocked<UserProfileRepository>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByIdWithProfile: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updatePassword: jest.fn(),
            updateEmail: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        {
          provide: UserProfileRepository,
          useValue: {
            findByUserId: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            content: {
              count: jest.fn(),
            },
            journalEntry: {
              count: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    profileRepository = module.get(UserProfileRepository);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return user if found', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@test.com',
        username: 'test',
        profile: {},
      };
      userRepository.findByIdWithProfile.mockResolvedValue(
        mockUser as unknown as UserPrismaPayload,
      );

      const result = await service.getCurrentUser(userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(userId);
      }
    });

    it('should return not found if user not exists', async () => {
      userRepository.findByIdWithProfile.mockResolvedValue(null);

      const result = await service.getCurrentUser('non-existent');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const userId = 'user-id';
      const dto = {
        bio: 'new bio',
        avatarUrl: 'http://avatar.com',
        profileFavorites: ['1'],
      };
      profileRepository.findByUserId.mockResolvedValue({ userId } as any);
      (prismaService.content.count as jest.Mock).mockResolvedValue(1);
      userRepository.findByIdWithProfile.mockResolvedValue({
        id: userId,
        profile: {},
      } as any);

      const result = await service.updateProfile(userId, dto);

      expect(result.success).toBe(true);
      expect(profileRepository.update).toHaveBeenCalledWith(
        { userId },
        expect.objectContaining(dto),
      );
    });

    it('should return not found if profile not exists', async () => {
      profileRepository.findByUserId.mockResolvedValue(null);

      const result = await service.updateProfile('user-id', {});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should validate profile favorites', async () => {
      const userId = 'user-id';
      const dto = { profileFavorites: ['1', '2', '3', '4', '5'] };
      profileRepository.findByUserId.mockResolvedValue({ userId } as any);

      const result = await service.updateProfile(userId, dto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
      }
    });

    it('should check if favorite content exists', async () => {
      const userId = 'user-id';
      const dto = { profileFavorites: ['1'] };
      profileRepository.findByUserId.mockResolvedValue({ userId } as any);
      (prismaService.content.count as jest.Mock).mockResolvedValue(0);

      const result = await service.updateProfile(userId, dto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
      }
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user-id';
      const dto = { currentPassword: 'old', newPassword: 'new' };
      userRepository.findById.mockResolvedValue({
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed');

      const result = await service.changePassword(userId, dto);

      expect(result.success).toBe(true);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        userId,
        'new-hashed',
      );
    });

    it('should return error if current password invalid', async () => {
      const userId = 'user-id';
      userRepository.findById.mockResolvedValue({
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.changePassword(userId, {
        currentPassword: 'wrong',
        newPassword: 'new',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.INVALID_CURRENT_PASSWORD);
      }
    });

    it('should return not found if user not exists', async () => {
      userRepository.findById.mockResolvedValue(null);
      const result = await service.changePassword('non-existent', {
        currentPassword: 'old',
        newPassword: 'new',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });
  });

  describe('changeEmail', () => {
    it('should change email successfully', async () => {
      const userId = 'user-id';
      const dto = { password: 'pwd', newEmail: 'new@test.com' };
      userRepository.findById.mockResolvedValue({
        id: userId,
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.changeEmail(userId, dto);

      expect(result.success).toBe(true);
      expect(userRepository.updateEmail).toHaveBeenCalledWith(
        userId,
        dto.newEmail,
      );
    });

    it('should return conflict if email already exists', async () => {
      const userId = 'user-id';
      const dto = { password: 'pwd', newEmail: 'existing@test.com' };
      userRepository.findById.mockResolvedValue({
        id: userId,
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue({ id: 'other-id' } as any);

      const result = await service.changeEmail(userId, dto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
      }
    });

    it('should return not found if user not exists', async () => {
      userRepository.findById.mockResolvedValue(null);
      const result = await service.changeEmail('non-existent', {
        password: 'pwd',
        newEmail: 'new@test.com',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should return error if password invalid', async () => {
      const userId = 'user-id';
      userRepository.findById.mockResolvedValue({
        id: userId,
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      const result = await service.changeEmail(userId, {
        password: 'wrong',
        newEmail: 'new@test.com',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.INVALID_PASSWORD);
      }
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const userId = 'user-id';
      const dto = { password: 'pwd' };
      userRepository.findById.mockResolvedValue({
        id: userId,
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.deleteAccount(userId, dto);

      expect(result.success).toBe(true);
      expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should return not found if user not exists', async () => {
      userRepository.findById.mockResolvedValue(null);
      const result = await service.deleteAccount('non-existent', {
        password: 'pwd',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should return error if password invalid', async () => {
      const userId = 'user-id';
      userRepository.findById.mockResolvedValue({
        id: userId,
        passwordHash: 'hashed',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      const result = await service.deleteAccount(userId, { password: 'wrong' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.INVALID_PASSWORD);
      }
    });
  });

  describe('calculateStats', () => {
    it('should calculate stats correctly', async () => {
      const userId = 'user-id';
      (prismaService.journalEntry.count as jest.Mock).mockResolvedValueOnce(10); // total
      (prismaService.journalEntry.count as jest.Mock).mockResolvedValueOnce(5); // favorites
      (prismaService.journalEntry.findMany as jest.Mock).mockResolvedValue([
        { rating: 4 },
        { rating: 5 },
      ]);

      const result = await service.calculateStats(userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalLogged).toBe(10);
        expect(result.data.favoritesCount).toBe(5);
        expect(result.data.meanRating).toBe(4.5);
      }
    });

    it('should handle no ratings', async () => {
      const userId = 'user-id';
      (prismaService.journalEntry.count as jest.Mock).mockResolvedValue(0);
      (prismaService.journalEntry.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.calculateStats(userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meanRating).toBe(0);
      }
    });
  });
});
