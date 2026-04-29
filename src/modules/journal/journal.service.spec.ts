/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal.service';
import { JournalRepository } from './journal.repository';
import { ContentRepository } from '../content/content.repository';
import { UserProfileRepository } from '../user/user-profile.repository';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { WatchStatus } from '../../common/enums/watch-status.enum';
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  QueryJournalEntryDto,
  SetProfileFavoritesDto,
  JournalSortBy,
  SortOrder,
} from './dto';

describe('JournalService', () => {
  let service: JournalService;
  let journalRepository: jest.Mocked<JournalRepository>;
  let contentRepository: jest.Mocked<ContentRepository>;
  let profileRepository: jest.Mocked<UserProfileRepository>;

  const mockUserId = 'user-uuid-1234';
  const mockContentId = 'content-uuid-1234';
  const mockEntryId = 'entry-uuid-1234';

  const mockContent = {
    id: mockContentId,
    title: 'Crash Landing on You',
    slug: 'crash-landing-on-you',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis: 'A South Korean heiress crash-lands in North Korea.',
    posterUrl: 'https://example.com/poster.jpg',
    genres: ['Romance', 'Drama'],
    cast: 'Hyun Bin, Son Ye-jin',
    episodes: 16,
    durationMinutes: null,
    country: 'South Korea',
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockJournalEntry: any = {
    id: mockEntryId,
    userId: mockUserId,
    contentId: mockContentId,
    status: WatchStatus.WATCHING,
    rating: 4.5,
    review: 'A masterpiece of storytelling.',
    isFavorite: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    content: mockContent,
  };

  const mockProfile = {
    userId: mockUserId,
    avatarUrl: null,
    bio: 'Test bio',
    profileFavorites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockJournalRepository = {
      create: jest.fn(),
      findByUserAndContent: jest.fn(),
      findByIdWithOwner: jest.fn(),
      findPaginatedByUser: jest.fn(),
      findByFavorites: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countTotalByUser: jest.fn(),
      countRatedByUser: jest.fn(),
      countFavoritesByUser: jest.fn(),
      getMeanRatingByUser: jest.fn(),
    };

    const mockContentRepository = {
      findById: jest.fn(),
    };

    const mockUserProfileRepository = {
      findByUserId: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        { provide: JournalRepository, useValue: mockJournalRepository },
        { provide: ContentRepository, useValue: mockContentRepository },
        { provide: UserProfileRepository, useValue: mockUserProfileRepository },
      ],
    }).compile();

    service = module.get<JournalService>(JournalService);
    journalRepository = module.get(JournalRepository);
    contentRepository = module.get(ContentRepository);
    profileRepository = module.get(UserProfileRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateJournalEntryDto = {
      contentId: mockContentId,
      status: WatchStatus.WATCHING,
    };

    it('should create entry with required status only', async () => {
      // Arrange
      contentRepository.findById.mockResolvedValue(mockContent);
      journalRepository.findByUserAndContent.mockResolvedValue(null);
      journalRepository.create.mockResolvedValue(mockJournalEntry);
      journalRepository.findByUserAndContent
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          ...mockJournalEntry,
          status: WatchStatus.WATCHING,
          rating: null,
          review: null,
          isFavorite: false,
        });

      // Act
      const result = await service.create(mockUserId, createDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: WatchStatus.WATCHING,
          isFavorite: false,
        }),
      );
    });

    it('should create entry with optional rating, review, favorite', async () => {
      // Arrange
      const fullDto: CreateJournalEntryDto = {
        contentId: mockContentId,
        status: WatchStatus.COMPLETED,
        rating: 4.5,
        review: 'A masterpiece of storytelling.',
        isFavorite: true,
      };

      contentRepository.findById.mockResolvedValue(mockContent);
      journalRepository.findByUserAndContent.mockResolvedValue(null);
      journalRepository.create.mockResolvedValue(mockJournalEntry);
      journalRepository.findByUserAndContent
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockJournalEntry);

      // Act
      const result = await service.create(mockUserId, fullDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: WatchStatus.COMPLETED,
          rating: 4.5,
          review: 'A masterpiece of storytelling.',
          isFavorite: true,
        }),
      );
    });

    it('should return ENTRY_ALREADY_EXISTS when duplicate (userId, contentId)', async () => {
      // Arrange
      contentRepository.findById.mockResolvedValue(mockContent);
      journalRepository.findByUserAndContent.mockResolvedValue(
        mockJournalEntry,
      );

      // Act
      const result = await service.create(mockUserId, createDto);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.ENTRY_ALREADY_EXISTS);
      }
    });

    it('should return VALIDATION_FAILED when content not found', async () => {
      // Arrange
      contentRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.create(mockUserId, createDto);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
      }
    });

    it('should enforce one-per-user-per-content (P0-JRN-001)', async () => {
      // Arrange - simulate existing entry
      contentRepository.findById.mockResolvedValue(mockContent);
      journalRepository.findByUserAndContent.mockResolvedValue(
        mockJournalEntry,
      );

      // Act
      const result = await service.create(mockUserId, createDto);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.ENTRY_ALREADY_EXISTS);
      }
      // Verify create was never called
      expect(journalRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getEntry', () => {
    it('should return entry when owner matches (P0-JRN-002)', async () => {
      // Arrange
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);

      // Act
      const result = await service.getEntry(mockEntryId, mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userId).toBe(mockUserId);
      }
    });

    it('should return error when entry not found or not owned', async () => {
      // Arrange
      journalRepository.findByIdWithOwner.mockResolvedValue(null);

      // Act
      const result = await service.getEntry(mockEntryId, mockUserId);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should not return entry belonging to different user', async () => {
      // Arrange - findByIdWithOwner returns null for different userId
      journalRepository.findByIdWithOwner.mockResolvedValue(null);

      // Act
      const result = await service.getEntry(mockEntryId, 'different-user-id');

      // Assert
      expect(result.success).toBe(false);
      expect(journalRepository.findByIdWithOwner).toHaveBeenCalledWith(
        mockEntryId,
        'different-user-id',
      );
    });
  });

  describe('update', () => {
    it('should update status field independently', async () => {
      // Arrange
      const updateDto: UpdateJournalEntryDto = {
        status: WatchStatus.COMPLETED,
      };
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);
      journalRepository.update.mockResolvedValue(mockJournalEntry);
      journalRepository.findByIdWithOwner.mockResolvedValue({
        ...mockJournalEntry,
        status: WatchStatus.COMPLETED,
      });

      // Act
      const result = await service.update(mockEntryId, mockUserId, updateDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.update).toHaveBeenCalledWith(
        { id: mockEntryId },
        { status: WatchStatus.COMPLETED },
      );
    });

    it('should update rating field independently', async () => {
      // Arrange
      const updateDto: UpdateJournalEntryDto = { rating: 5.0 };
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);
      journalRepository.update.mockResolvedValue({
        ...mockJournalEntry,
        rating: 5.0,
      });

      // Act
      const result = await service.update(mockEntryId, mockUserId, updateDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.update).toHaveBeenCalledWith(
        { id: mockEntryId },
        { rating: 5.0 },
      );
    });

    it('should update review field independently', async () => {
      // Arrange
      const updateDto: UpdateJournalEntryDto = { review: 'Updated review' };
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);
      journalRepository.update.mockResolvedValue(mockJournalEntry);

      // Act
      const result = await service.update(mockEntryId, mockUserId, updateDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.update).toHaveBeenCalledWith(
        { id: mockEntryId },
        { review: 'Updated review' },
      );
    });

    it('should update isFavorite field independently', async () => {
      // Arrange
      const updateDto: UpdateJournalEntryDto = { isFavorite: false };
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);
      journalRepository.update.mockResolvedValue(mockJournalEntry);

      // Act
      const result = await service.update(mockEntryId, mockUserId, updateDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.update).toHaveBeenCalledWith(
        { id: mockEntryId },
        { isFavorite: false },
      );
    });

    it('should clear rating (set to null)', async () => {
      // Arrange

      const updateDto: any = { rating: null };
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);
      journalRepository.update.mockResolvedValue({
        ...mockJournalEntry,
        rating: null,
      });

      // Act
      const result = await service.update(mockEntryId, mockUserId, updateDto);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.update).toHaveBeenCalledWith(
        { id: mockEntryId },
        { rating: null },
      );
    });

    it('should return error when updating non-owned entry', async () => {
      // Arrange
      const updateDto: UpdateJournalEntryDto = {
        status: WatchStatus.COMPLETED,
      };
      journalRepository.findByIdWithOwner.mockResolvedValue(null);

      // Act
      const result = await service.update(mockEntryId, mockUserId, updateDto);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('should enforce ownership on update (P0-JRN-002)', async () => {
      // Arrange
      const updateDto: UpdateJournalEntryDto = {
        status: WatchStatus.COMPLETED,
      };
      journalRepository.findByIdWithOwner.mockResolvedValue(null);

      // Act
      const result = await service.update(
        mockEntryId,
        'different-user-id',
        updateDto,
      );

      // Assert
      expect(result.success).toBe(false);
      expect(journalRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete entry permanently when owner matches', async () => {
      // Arrange
      journalRepository.findByIdWithOwner.mockResolvedValue(mockJournalEntry);
      journalRepository.delete.mockResolvedValue(mockJournalEntry);

      // Act
      const result = await service.delete(mockEntryId, mockUserId);

      // Assert
      expect(result.success).toBe(true);
      expect(journalRepository.delete).toHaveBeenCalledWith({
        id: mockEntryId,
      });
    });

    it('should return error when deleting non-owned entry', async () => {
      // Arrange
      journalRepository.findByIdWithOwner.mockResolvedValue(null);

      // Act
      const result = await service.delete(mockEntryId, mockUserId);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
      expect(journalRepository.delete).not.toHaveBeenCalled();
    });

    it('should enforce ownership on delete (P0-JRN-002)', async () => {
      // Arrange
      journalRepository.findByIdWithOwner.mockResolvedValue(null);

      // Act
      const result = await service.delete(mockEntryId, 'different-user-id');

      // Assert
      expect(result.success).toBe(false);
      expect(journalRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getEntries', () => {
    const defaultQuery: QueryJournalEntryDto = {
      page: 1,
      limit: 20,
      status: 'ALL',
      sort: JournalSortBy.UPDATED_AT,
      order: SortOrder.DESC,
    };

    it('should return paginated entries', async () => {
      // Arrange
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [mockJournalEntry],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      // Act
      const result = await service.getEntries(mockUserId, defaultQuery);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.meta.total).toBe(1);
      }
    });

    it('should filter by WATCHING status', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        status: WatchStatus.WATCHING,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [mockJournalEntry],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ status: WatchStatus.WATCHING }),
      );
    });

    it('should filter by COMPLETED status', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        status: WatchStatus.COMPLETED,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ status: WatchStatus.COMPLETED }),
      );
    });

    it('should filter by DROPPED status', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        status: WatchStatus.DROPPED,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ status: WatchStatus.DROPPED }),
      );
    });

    it('should filter by PLAN_TO_WATCH status', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        status: WatchStatus.PLAN_TO_WATCH,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ status: WatchStatus.PLAN_TO_WATCH }),
      );
    });

    it('should sort by updatedAt descending', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        sort: JournalSortBy.UPDATED_AT,
        order: SortOrder.DESC,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [mockJournalEntry],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'updatedAt', order: 'desc' }),
      );
    });

    it('should sort by createdAt ascending', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        sort: JournalSortBy.CREATED_AT,
        order: SortOrder.ASC,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [mockJournalEntry],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'createdAt', order: 'asc' }),
      );
    });

    it('should sort by rating descending', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        sort: JournalSortBy.RATING,
        order: SortOrder.DESC,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [mockJournalEntry],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'rating', order: 'desc' }),
      );
    });

    it('should sort by title ascending', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        sort: JournalSortBy.TITLE,
        order: SortOrder.ASC,
      };
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [mockJournalEntry],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      // Act
      await service.getEntries(mockUserId, query);

      // Assert
      expect(journalRepository.findPaginatedByUser).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'title', order: 'asc' }),
      );
    });

    it('should return empty array when no entries', async () => {
      // Arrange
      journalRepository.findPaginatedByUser.mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      // Act
      const result = await service.getEntries(mockUserId, defaultQuery);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(0);
        expect(result.data.meta.total).toBe(0);
      }
    });
  });

  describe('getFavorites', () => {
    it('should return all isFavorite=true entries', async () => {
      // Arrange
      const favoriteEntry = { ...mockJournalEntry, isFavorite: true };
      journalRepository.findByFavorites.mockResolvedValue([favoriteEntry]);
      profileRepository.findByUserId.mockResolvedValue(mockProfile);

      // Act
      const result = await service.getFavorites(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0].isFavorite).toBe(true);
      }
    });

    it('should return profileFavorites array', async () => {
      // Arrange
      const profileWithFavorites = {
        ...mockProfile,
        profileFavorites: [mockEntryId],
      };
      journalRepository.findByFavorites.mockResolvedValue([]);
      profileRepository.findByUserId.mockResolvedValue(profileWithFavorites);

      // Act
      const result = await service.getFavorites(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profileFavorites).toContain(mockEntryId);
      }
    });

    it('should return empty arrays when no favorites', async () => {
      // Arrange
      journalRepository.findByFavorites.mockResolvedValue([]);
      profileRepository.findByUserId.mockResolvedValue(mockProfile);

      // Act
      const result = await service.getFavorites(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(0);
        expect(result.data.profileFavorites).toHaveLength(0);
      }
    });
  });

  describe('setProfileFavorites', () => {
    it('should set profile favorites with valid entries', async () => {
      // Arrange
      const dto: SetProfileFavoritesDto = {
        entryIds: [mockEntryId],
      };
      const favoriteEntry = { ...mockJournalEntry, isFavorite: true };
      journalRepository.findMany.mockResolvedValue([favoriteEntry]);
      profileRepository.update.mockResolvedValue(mockProfile);

      // Act
      const result = await service.setProfileFavorites(mockUserId, dto);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profileFavorites).toContain(mockEntryId);
      }
    });

    it('should reject more than 4 profile favorites', async () => {
      // Note: The DTO validates max 4, but service also validates
      // This test verifies the service layer behavior
      const fiveIds = [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440005',
      ];
      const dto: SetProfileFavoritesDto = {
        entryIds: fiveIds,
      };

      // The DTO should reject this via ArrayMaxSize(4), but we test service too
      // If somehow invalid DTO passes, service should handle gracefully
      journalRepository.findMany.mockResolvedValue([]);

      // Act
      const result = await service.setProfileFavorites(mockUserId, dto);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should reject non-favorite entries as profile favorites', async () => {
      // Arrange
      const dto: SetProfileFavoritesDto = {
        entryIds: [mockEntryId],
      };
      // findMany returns empty because query includes isFavorite: true filter
      // but the entry is not a favorite
      journalRepository.findMany.mockResolvedValue([]);

      // Act
      const result = await service.setProfileFavorites(mockUserId, dto);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
      }
    });

    it('should reject entries not owned by user', async () => {
      // Arrange
      const dto: SetProfileFavoritesDto = {
        entryIds: [mockEntryId],
      };
      // findMany returns empty because entry doesn't belong to user
      journalRepository.findMany.mockResolvedValue([]);

      // Act
      const result = await service.setProfileFavorites(mockUserId, dto);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
      }
    });

    it('should accept exactly 4 profile favorites', async () => {
      // Arrange
      const entryIds = [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
      ];
      const dto: SetProfileFavoritesDto = { entryIds };
      const entries = entryIds.map((id, i) => ({
        ...mockJournalEntry,
        id,
        isFavorite: true,
        content: { ...mockContent, title: `Content ${i}` },
      }));
      journalRepository.findMany.mockResolvedValue(entries);
      profileRepository.update.mockResolvedValue(mockProfile);

      // Act
      const result = await service.setProfileFavorites(mockUserId, dto);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profileFavorites).toHaveLength(4);
      }
    });
  });

  describe('getStats', () => {
    it('should return totalLogged count', async () => {
      // Arrange
      journalRepository.countTotalByUser.mockResolvedValue(10);
      journalRepository.countRatedByUser.mockResolvedValue(8);
      journalRepository.countFavoritesByUser.mockResolvedValue(3);
      journalRepository.getMeanRatingByUser.mockResolvedValue(4.2);

      // Act
      const result = await service.getStats(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalLogged).toBe(10);
      }
    });

    it('should return meanRating excluding unrated entries', async () => {
      // Arrange
      journalRepository.countTotalByUser.mockResolvedValue(10);
      journalRepository.countRatedByUser.mockResolvedValue(5);
      journalRepository.countFavoritesByUser.mockResolvedValue(2);
      journalRepository.getMeanRatingByUser.mockResolvedValue(4.2);

      // Act
      const result = await service.getStats(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meanRating).toBe(4.2);
      }
    });

    it('should return favoritesCount', async () => {
      // Arrange
      journalRepository.countTotalByUser.mockResolvedValue(10);
      journalRepository.countRatedByUser.mockResolvedValue(8);
      journalRepository.countFavoritesByUser.mockResolvedValue(3);
      journalRepository.getMeanRatingByUser.mockResolvedValue(4.2);

      // Act
      const result = await service.getStats(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.favoritesCount).toBe(3);
      }
    });

    it('should return meanRating 0 when no rated entries', async () => {
      // Arrange
      journalRepository.countTotalByUser.mockResolvedValue(5);
      journalRepository.countRatedByUser.mockResolvedValue(0);
      journalRepository.countFavoritesByUser.mockResolvedValue(0);
      journalRepository.getMeanRatingByUser.mockResolvedValue(0);

      // Act
      const result = await service.getStats(mockUserId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meanRating).toBe(0);
      }
    });
  });
});
