/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { WatchStatus } from '../../common/enums/watch-status.enum';
import { ContentType } from '../../common/enums/content-type.enum';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: jest.Mocked<ProfileService>;

  const mockPublicProfile = {
    id: 'user-id',
    username: 'testuser',
    profile: {
      userId: 'user-id',
      avatarUrl: 'http://avatar.com',
      bio: 'K-drama fan',
      profileFavorites: ['content-1'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    profileFavorites: [
      {
        id: 'content-1',
        title: 'Test Drama',
        slug: 'test-drama',
        type: ContentType.DRAMA,
        year: 2023,
        synopsis: 'Test synopsis',
        posterUrl: 'http://poster.com',
        genres: ['Romance'],
        cast: 'Actor 1, Actor 2',
        episodes: 16,
        durationMinutes: null,
        country: 'South Korea',
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    stats: {
      totalLogged: 10,
      meanRating: 4.5,
      favoritesCount: 3,
    },
  };

  const mockSearchResult = {
    items: [
      {
        id: 'user-1',
        username: 'kdrama_fan',
        profile: { avatarUrl: 'http://avatar.com', bio: 'K-drama fan' },
      },
    ],
  };

  const mockJournalEntries = {
    items: [
      {
        id: 'entry-1',
        userId: 'user-id',
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
          slug: 'test-drama',
          type: ContentType.DRAMA,
          year: 2023,
          synopsis: 'Test synopsis',
          posterUrl: 'http://poster.com',
          genres: ['Romance'],
          cast: 'Actor 1, Actor 2',
          episodes: 16,
          durationMinutes: null,
          country: 'South Korea',
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
    meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
  };

  beforeEach(async () => {
    const mockProfileService = {
      getProfile: jest.fn(),
      getPublicJournal: jest.fn(),
      searchUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get(ProfileService);
  });

  describe('searchUsers', () => {
    it('should return search results', async () => {
      profileService.searchUsers.mockResolvedValue({
        success: true,
        data: mockSearchResult,
      });

      const result = await controller.searchUsers({ q: 'kdrama', limit: 10 });

      expect(profileService.searchUsers).toHaveBeenCalledWith({
        q: 'kdrama',
        limit: 10,
      });
      expect(result).toEqual(mockSearchResult);
    });

    it('should delegate to service with default limit', async () => {
      profileService.searchUsers.mockResolvedValue({
        success: true,
        data: { items: [] },
      });

      await controller.searchUsers({ q: 'test' });

      expect(profileService.searchUsers).toHaveBeenCalledWith({
        q: 'test',
        limit: undefined,
      });
    });

    it('should throw error when service returns error', async () => {
      profileService.searchUsers.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          message: 'Invalid query',
        },
      });

      await expect(controller.searchUsers({ q: '' })).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    it('should return public profile for existing user', async () => {
      profileService.getProfile.mockResolvedValue({
        success: true,
        data: mockPublicProfile,
      } as any);

      const result = await controller.getProfile('testuser');

      expect(profileService.getProfile).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockPublicProfile);
    });

    it('should throw error for non-existent user', async () => {
      profileService.getProfile.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        },
      } as any);

      await expect(controller.getProfile('nonexistent')).rejects.toThrow();
    });

    it('should handle case-insensitive username lookup', async () => {
      profileService.getProfile.mockResolvedValue({
        success: true,
        data: mockPublicProfile,
      } as any);

      await controller.getProfile('TestUser');

      expect(profileService.getProfile).toHaveBeenCalledWith('TestUser');
    });
  });

  describe('getPublicJournal', () => {
    it('should return paginated journal entries', async () => {
      profileService.getPublicJournal.mockResolvedValue({
        success: true,
        data: mockJournalEntries,
      } as any);

      const result = await controller.getPublicJournal('testuser', {
        page: 1,
        limit: 20,
      });

      expect(profileService.getPublicJournal).toHaveBeenCalledWith('testuser', {
        page: 1,
        limit: 20,
      });
      expect(result).toEqual(mockJournalEntries);
    });

    it('should pass query parameters correctly', async () => {
      profileService.getPublicJournal.mockResolvedValue({
        success: true,
        data: {
          items: [],
          meta: { total: 0, page: 2, limit: 10, totalPages: 0 },
        },
      });

      await controller.getPublicJournal('testuser', {
        page: 2,
        limit: 10,
        status: WatchStatus.COMPLETED,
        sort: 'rating',
        order: 'desc',
      });

      expect(profileService.getPublicJournal).toHaveBeenCalledWith('testuser', {
        page: 2,
        limit: 10,
        status: WatchStatus.COMPLETED,
        sort: 'rating',
        order: 'desc',
      });
    });

    it('should throw error for non-existent user', async () => {
      profileService.getPublicJournal.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        },
      });

      await expect(
        controller.getPublicJournal('nonexistent', { page: 1, limit: 20 }),
      ).rejects.toThrow();
    });
  });
});
