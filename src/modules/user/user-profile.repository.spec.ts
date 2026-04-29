/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import {
  UserProfileRepository,
  UserProfileWithFavorites,
} from './user-profile.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserProfileRepository', () => {
  let repository: UserProfileRepository;
  let prismaService: {
    userProfile: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    content: {
      findMany: jest.Mock;
    };
  };

  const mockProfile = {
    userId: 'user-uuid-1234',
    avatarUrl: null,
    bio: 'Test bio',
    profileFavorites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContent = {
    id: 'content-uuid-1234',
    title: 'Crash Landing on You',
    slug: 'crash-landing-on-you',
    type: 'DRAMA',
    year: 2019,
    synopsis: 'Test synopsis',
    posterUrl: 'https://example.com/poster.jpg',
    genres: ['Romance'],
    cast: 'Hyun Bin',
    episodes: 16,
    durationMinutes: null,
    country: 'South Korea',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaService = {
      userProfile: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      content: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileRepository,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    repository = module.get<UserProfileRepository>(UserProfileRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('should return profile by user id', async () => {
      // Arrange
      prismaService.userProfile.findUnique.mockResolvedValue(mockProfile);

      // Act
      const result = await repository.findByUserId('user-uuid-1234');

      // Assert
      expect(prismaService.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1234' },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      prismaService.userProfile.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByUserId('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByUserIdWithFavorites', () => {
    it('should return profile with favorites', async () => {
      // Arrange
      const profileWithFavorites = {
        ...mockProfile,
        profileFavorites: ['content-uuid-1234'],
      };
      prismaService.userProfile.findUnique.mockResolvedValue(
        profileWithFavorites,
      );
      prismaService.content.findMany.mockResolvedValue([mockContent]);

      // Act
      const result =
        await repository.findByUserIdWithFavorites('user-uuid-1234');

      // Assert
      expect(result).toBeDefined();
      expect(result?.favorites).toHaveLength(1);
      expect(result?.favorites[0].title).toBe('Crash Landing on You');
    });

    it('should return null when profile not found', async () => {
      // Arrange
      prismaService.userProfile.findUnique.mockResolvedValue(null);

      // Act
      const result =
        await repository.findByUserIdWithFavorites('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return empty favorites array when profileFavorites is null', async () => {
      // Arrange
      const profileWithNullFavorites = {
        ...mockProfile,
        profileFavorites: null,
      };
      prismaService.userProfile.findUnique.mockResolvedValue(
        profileWithNullFavorites,
      );

      // Act
      const result =
        await repository.findByUserIdWithFavorites('user-uuid-1234');

      // Assert
      expect(result?.favorites).toEqual([]);
    });

    it('should return empty favorites array when profileFavorites is empty', async () => {
      // Arrange
      const profileWithEmptyFavorites = {
        ...mockProfile,
        profileFavorites: [],
      };
      prismaService.userProfile.findUnique.mockResolvedValue(
        profileWithEmptyFavorites,
      );

      // Act
      const result =
        await repository.findByUserIdWithFavorites('user-uuid-1234');

      // Assert
      expect(result?.favorites).toEqual([]);
      expect(prismaService.content.findMany).not.toHaveBeenCalled();
    });

    it('should fetch multiple favorites', async () => {
      // Arrange
      const profileWithMultipleFavorites = {
        ...mockProfile,
        profileFavorites: ['content-uuid-1', 'content-uuid-2'],
      };
      const content1 = {
        ...mockContent,
        id: 'content-uuid-1',
        title: 'Content 1',
      };
      const content2 = {
        ...mockContent,
        id: 'content-uuid-2',
        title: 'Content 2',
      };
      prismaService.userProfile.findUnique.mockResolvedValue(
        profileWithMultipleFavorites,
      );
      prismaService.content.findMany.mockResolvedValue([content1, content2]);

      // Act
      const result =
        await repository.findByUserIdWithFavorites('user-uuid-1234');

      // Assert
      expect(result?.favorites).toHaveLength(2);
      expect(prismaService.content.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['content-uuid-1', 'content-uuid-2'] } },
      });
    });
  });

  describe('update', () => {
    it('should update profile', async () => {
      // Arrange
      const updatedProfile = {
        ...mockProfile,
        bio: 'Updated bio',
      };
      prismaService.userProfile.update.mockResolvedValue(updatedProfile);

      // Act
      const result = await repository.update(
        { userId: 'user-uuid-1234' },
        { bio: 'Updated bio' },
      );

      // Assert
      expect(prismaService.userProfile.update).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1234' },
        data: { bio: 'Updated bio' },
      });
      expect(result.bio).toBe('Updated bio');
    });
  });

  describe('create', () => {
    it('should create profile', async () => {
      // Arrange
      const createData = {
        userId: 'user-uuid-1234',
        avatarUrl: null,
        bio: 'New bio',
        profileFavorites: [],
        user: { connect: { id: 'user-uuid-1234' } },
      } as any;
      prismaService.userProfile.create.mockResolvedValue(mockProfile);

      // Act
      const result = await repository.create(createData);

      // Assert
      expect(prismaService.userProfile.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toBeDefined();
    });
  });
});
