/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { UserRepository } from '../user/user.repository';
import { UserProfileRepository } from '../user/user-profile.repository';
import { JournalRepository } from '../journal/journal.repository';
import { ContentRepository } from '../content/content.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { WatchStatus } from '../../common/enums/watch-status.enum';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: jest.Mocked<UserProfileRepository>;
  let journalRepository: jest.Mocked<JournalRepository>;
  let contentRepository: jest.Mocked<ContentRepository>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: UserProfileRepository,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
        {
          provide: JournalRepository,
          useValue: {
            findPaginatedByUser: jest.fn(),
            countTotalByUser: jest.fn(),
            countFavoritesByUser: jest.fn(),
            getMeanRatingByUser: jest.fn(),
          },
        },
        {
          provide: ContentRepository,
          useValue: {
            findMany: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(UserProfileRepository);
    journalRepository = module.get(JournalRepository);
    contentRepository = module.get(ContentRepository);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return public profile with favorites and stats', async () => {
      const username = 'testuser';
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@test.com',
        username: 'testuser',
      };
      const mockProfile = {
        userId,
        avatarUrl: 'http://avatar.com',
        bio: 'K-drama fan',
        profileFavorites: ['content-1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockContent = {
        id: 'content-1',
        title: 'Test Drama',
        slug: 'test-drama',
        type: 'DRAMA',
        posterUrl: 'http://poster.com',
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      profileRepository.findByUserId.mockResolvedValue(mockProfile);
      journalRepository.countTotalByUser.mockResolvedValue(10);
      journalRepository.countFavoritesByUser.mockResolvedValue(3);
      journalRepository.getMeanRatingByUser.mockResolvedValue(4.5);
      (contentRepository.findMany as jest.Mock).mockResolvedValue([
        mockContent,
      ]);

      const result = await service.getProfile(username);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(userId);
        expect(result.data.username).toBe(username);
        expect(result.data.stats.totalLogged).toBe(10);
        expect(result.data.stats.favoritesCount).toBe(3);
        expect(result.data.stats.meanRating).toBe(4.5);
      }
    });

    it('should return 404 for non-existent user', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getProfile('nonexistent');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should handle case-insensitive username lookup', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'TestUser',
      };
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      profileRepository.findByUserId.mockResolvedValue(null);
      journalRepository.countTotalByUser.mockResolvedValue(0);
      journalRepository.countFavoritesByUser.mockResolvedValue(0);
      journalRepository.getMeanRatingByUser.mockResolvedValue(0);

      const result = await service.getProfile('testuser');

      expect(result.success).toBe(true);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: {
            equals: 'testuser',
            mode: 'insensitive',
          },
        },
      });
    });

    it('should handle user without profile', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
      };
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      profileRepository.findByUserId.mockResolvedValue(null);
      journalRepository.countTotalByUser.mockResolvedValue(0);
      journalRepository.countFavoritesByUser.mockResolvedValue(0);
      journalRepository.getMeanRatingByUser.mockResolvedValue(0);

      const result = await service.getProfile('testuser');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profile).toBeUndefined();
      }
    });
  });

  describe('getPublicJournal', () => {
    it('should return paginated journal entries', async () => {
      const username = 'testuser';
      const userId = 'user-id';
      const mockUser = { id: userId, username };
      const mockEntries = [
        {
          id: 'entry-1',
          userId,
          contentId: 'content-1',
          status: WatchStatus.COMPLETED,
          rating: 4.5,
          review: 'Great show',
          isFavorite: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          content: {
            id: 'content-1',
            title: 'Test Drama',
            type: 'DRAMA',
          },
        },
      ];

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (journalRepository.findPaginatedByUser as jest.Mock).mockResolvedValue({
        items: mockEntries,
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      const result = await service.getPublicJournal(username, {
        page: 1,
        limit: 20,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.meta.total).toBe(1);
      }
    });

    it('should return 404 for non-existent user', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getPublicJournal('nonexistent', {
        page: 1,
        limit: 20,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should pass query parameters correctly', async () => {
      const mockUser = { id: 'user-id', username: 'testuser' };
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (journalRepository.findPaginatedByUser as jest.Mock).mockResolvedValue({
        items: [],
        meta: { total: 0, page: 2, limit: 10, totalPages: 0 },
      });

      await service.getPublicJournal('testuser', {
        page: 2,
        limit: 10,
        status: WatchStatus.COMPLETED,
        sort: 'rating',
        order: 'desc',
      });

      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith({
        userId: 'user-id',
        page: 2,
        limit: 10,
        status: WatchStatus.COMPLETED,
        sort: 'rating',
        order: 'desc',
      });
    });
  });

  describe('searchUsers', () => {
    it('should return matching users (case-insensitive partial match)', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          username: 'kdrama_fan',
          profile: { avatarUrl: 'http://avatar.com', bio: 'K-drama fan' },
        },
        {
          id: 'user-2',
          username: 'kdramalover',
          profile: null,
        },
      ];
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.searchUsers({ q: 'kdrama', limit: 10 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(2);
        expect(result.data.items[0].username).toBe('kdrama_fan');
        expect(result.data.items[0].profile).toBeDefined();
        expect(result.data.items[1].profile).toBeUndefined();
      }
    });

    it('should return empty array for no matches', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.searchUsers({ q: 'nonexistent', limit: 10 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(0);
      }
    });

    it('should respect limit parameter', async () => {
      const mockUsers = Array.from({ length: 15 }, (_, i) => ({
        id: `user-${i}`,
        username: `testuser${i}`,
        profile: null,
      }));
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(
        mockUsers.slice(0, 5),
      );

      await service.searchUsers({ q: 'test', limit: 5 });

      expect(prismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });

    it('should return username, avatar, bio snippet', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          username: 'testuser',
          profile: {
            avatarUrl: 'http://avatar.com',
            bio: 'This is a long bio that should be returned as-is for now',
          },
        },
      ];
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.searchUsers({ q: 'test', limit: 10 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items[0].username).toBe('testuser');
        expect(result.data.items[0].profile?.avatarUrl).toBe(
          'http://avatar.com',
        );
        expect(result.data.items[0].profile?.bio).toContain(
          'This is a long bio',
        );
      }
    });
  });

  describe('calculateStats', () => {
    it('should calculate stats: totalLogged, meanRating, favoritesCount', async () => {
      journalRepository.countTotalByUser.mockResolvedValue(25);
      journalRepository.countFavoritesByUser.mockResolvedValue(7);
      journalRepository.getMeanRatingByUser.mockResolvedValue(4.3);

      const stats = await service.calculateStats('user-id');

      expect(stats.totalLogged).toBe(25);
      expect(stats.favoritesCount).toBe(7);
      expect(stats.meanRating).toBe(4.3);
    });

    it('should handle zero entries', async () => {
      journalRepository.countTotalByUser.mockResolvedValue(0);
      journalRepository.countFavoritesByUser.mockResolvedValue(0);
      journalRepository.getMeanRatingByUser.mockResolvedValue(0);

      const stats = await service.calculateStats('user-id');

      expect(stats.totalLogged).toBe(0);
      expect(stats.favoritesCount).toBe(0);
      expect(stats.meanRating).toBe(0);
    });

    it('should round meanRating to 1 decimal place', async () => {
      journalRepository.countTotalByUser.mockResolvedValue(10);
      journalRepository.countFavoritesByUser.mockResolvedValue(3);
      journalRepository.getMeanRatingByUser.mockResolvedValue(4.333333);

      const stats = await service.calculateStats('user-id');

      expect(stats.meanRating).toBe(4.3);
    });
  });

  describe('getProfileFavoritesContent', () => {
    it('should return undefined when profileFavorites is empty array', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
      };
      const mockProfileWithEmptyFavorites = {
        userId: 'user-id',
        avatarUrl: null,
        bio: null,
        profileFavorites: [], // Empty array
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      profileRepository.findByUserId.mockResolvedValue(
        mockProfileWithEmptyFavorites,
      );
      journalRepository.countTotalByUser.mockResolvedValue(0);
      journalRepository.countFavoritesByUser.mockResolvedValue(0);
      journalRepository.getMeanRatingByUser.mockResolvedValue(0);

      const result = await service.getProfile('testuser');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profileFavorites).toBeUndefined();
      }
    });

    it('should return undefined when profile has no profileFavorites', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
      };
      const mockProfileNoFavorites = {
        userId: 'user-id',
        avatarUrl: null,
        bio: null,
        profileFavorites: null, // null value
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      profileRepository.findByUserId.mockResolvedValue(mockProfileNoFavorites);
      journalRepository.countTotalByUser.mockResolvedValue(0);
      journalRepository.countFavoritesByUser.mockResolvedValue(0);
      journalRepository.getMeanRatingByUser.mockResolvedValue(0);

      const result = await service.getProfile('testuser');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profileFavorites).toBeUndefined();
      }
    });
  });
});
