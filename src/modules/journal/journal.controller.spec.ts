/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { WatchStatus } from '../../common/enums/watch-status.enum';
import { ErrorCode } from '../../common/enums/error-code.enum';
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  QueryJournalEntryDto,
  SetProfileFavoritesDto,
  JournalSortBy,
  SortOrder,
} from './dto';
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('JournalController', () => {
  let controller: JournalController;
  let journalService: jest.Mocked<JournalService>;

  const mockUserId = 'user-uuid-1234';
  const mockContentId = 'content-uuid-1234';
  const mockEntryId = 'entry-uuid-1234';

  const mockRequest = {
    user: {
      userId: mockUserId,
      email: 'test@example.com',
      role: 'USER',
    },
  };

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
    avgRating: 4.5,
    loggedCount: 100,
  } as any;

  const mockJournalEntry = {
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
  } as any;

  beforeEach(async () => {
    const mockJournalService = {
      create: jest.fn(),
      getEntry: jest.fn(),
      getEntries: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getFavorites: jest.fn(),
      setProfileFavorites: jest.fn(),
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalController],
      providers: [{ provide: JournalService, useValue: mockJournalService }],
    }).compile();

    controller = module.get<JournalController>(JournalController);
    journalService = module.get(JournalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEntries', () => {
    const defaultQuery: QueryJournalEntryDto = {
      page: 1,
      limit: 20,
      status: 'ALL',
      sort: JournalSortBy.UPDATED_AT,
      order: SortOrder.DESC,
    };

    it('should return paginated journal entries', async () => {
      // Arrange
      journalService.getEntries.mockResolvedValue({
        success: true,
        data: {
          items: [mockJournalEntry],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        },
      });

      // Act
      const result = await controller.getEntries(
        mockRequest as any,
        defaultQuery,
      );

      // Assert
      expect(journalService.getEntries).toHaveBeenCalledWith(
        mockUserId,
        defaultQuery,
      );
      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        status: WatchStatus.WATCHING,
      };
      journalService.getEntries.mockResolvedValue({
        success: true,
        data: {
          items: [mockJournalEntry],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        },
      });

      // Act
      await controller.getEntries(mockRequest as any, query);

      // Assert
      expect(journalService.getEntries).toHaveBeenCalledWith(mockUserId, query);
    });

    it('should sort by different fields', async () => {
      // Arrange
      const query: QueryJournalEntryDto = {
        ...defaultQuery,
        sort: JournalSortBy.RATING,
        order: SortOrder.DESC,
      };
      journalService.getEntries.mockResolvedValue({
        success: true,
        data: {
          items: [mockJournalEntry],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        },
      });

      // Act
      await controller.getEntries(mockRequest as any, query);

      // Assert
      expect(journalService.getEntries).toHaveBeenCalledWith(mockUserId, query);
    });

    it('should return empty array when no entries', async () => {
      // Arrange
      journalService.getEntries.mockResolvedValue({
        success: true,
        data: {
          items: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        },
      });

      // Act
      const result = await controller.getEntries(
        mockRequest as any,
        defaultQuery,
      );

      // Assert
      expect(result.items).toHaveLength(0);
    });
  });

  describe('create', () => {
    const createDto: CreateJournalEntryDto = {
      contentId: mockContentId,
      status: WatchStatus.WATCHING,
    };

    it('should create journal entry with status only', async () => {
      // Arrange
      journalService.create.mockResolvedValue({
        success: true,
        data: mockJournalEntry,
      });

      // Act
      const result = await controller.create(mockRequest as any, createDto);

      // Assert
      expect(journalService.create).toHaveBeenCalledWith(mockUserId, createDto);
      expect(result.id).toBe(mockEntryId);
    });

    it('should create journal entry with all fields', async () => {
      // Arrange
      const fullDto: CreateJournalEntryDto = {
        contentId: mockContentId,
        status: WatchStatus.COMPLETED,
        rating: 4.5,
        review: 'A masterpiece of storytelling.',
        isFavorite: true,
      };
      journalService.create.mockResolvedValue({
        success: true,
        data: mockJournalEntry,
      });

      // Act
      const result = await controller.create(mockRequest as any, fullDto);

      // Assert
      expect(journalService.create).toHaveBeenCalledWith(mockUserId, fullDto);
      expect(result).toBeDefined();
    });

    it('should throw error for duplicate entry', async () => {
      // Arrange
      journalService.create.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.ENTRY_ALREADY_EXISTS,
          message: 'Entry already exists',
        },
      });

      // Act & Assert
      await expect(
        controller.create(mockRequest as any, createDto),
      ).rejects.toThrow();
    });
  });

  describe('getFavorites', () => {
    it('should return favorite entries with profile favorites', async () => {
      // Arrange
      journalService.getFavorites.mockResolvedValue({
        success: true,
        data: {
          items: [mockJournalEntry],
          profileFavorites: [mockEntryId],
        },
      });

      // Act
      const result = await controller.getFavorites(mockRequest as any);

      // Assert
      expect(journalService.getFavorites).toHaveBeenCalledWith(mockUserId);
      expect(result.items).toHaveLength(1);
      expect(result.profileFavorites).toContain(mockEntryId);
    });

    it('should return empty arrays when no favorites', async () => {
      // Arrange
      journalService.getFavorites.mockResolvedValue({
        success: true,
        data: {
          items: [],
          profileFavorites: [],
        },
      });

      // Act
      const result = await controller.getFavorites(mockRequest as any);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.profileFavorites).toHaveLength(0);
    });
  });

  describe('setProfileFavorites', () => {
    const dto: SetProfileFavoritesDto = {
      entryIds: [mockEntryId],
    };

    it('should set profile favorites successfully', async () => {
      // Arrange
      journalService.setProfileFavorites.mockResolvedValue({
        success: true,
        data: {
          profileFavorites: [mockEntryId],
        },
      });

      // Act
      const result = await controller.setProfileFavorites(
        mockRequest as any,
        dto,
      );

      // Assert
      expect(journalService.setProfileFavorites).toHaveBeenCalledWith(
        mockUserId,
        dto,
      );
      expect(result.profileFavorites).toContain(mockEntryId);
    });

    it('should reject more than 4 profile favorites', async () => {
      // Arrange
      const invalidDto: SetProfileFavoritesDto = {
        entryIds: [
          '550e8400-e29b-41d4-a716-446655440001',
          '550e8400-e29b-41d4-a716-446655440002',
          '550e8400-e29b-41d4-a716-446655440003',
          '550e8400-e29b-41d4-a716-446655440004',
          '550e8400-e29b-41d4-a716-446655440005',
        ],
      };
      journalService.setProfileFavorites.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          message: 'Maximum 4 profile favorites allowed',
        },
      });

      // Act & Assert
      await expect(
        controller.setProfileFavorites(mockRequest as any, invalidDto),
      ).rejects.toThrow();
    });
  });

  describe('getEntry', () => {
    it('should return journal entry for owner', async () => {
      // Arrange
      journalService.getEntry.mockResolvedValue({
        success: true,
        data: mockJournalEntry,
      });

      // Act
      const result = await controller.getEntry(mockRequest as any, mockEntryId);

      // Assert
      expect(journalService.getEntry).toHaveBeenCalledWith(
        mockEntryId,
        mockUserId,
      );
      expect(result.id).toBe(mockEntryId);
    });

    it('should throw error for non-owned entry', async () => {
      // Arrange
      journalService.getEntry.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.USER_NOT_FOUND,
          message: 'Entry not found',
        },
      });

      // Act & Assert
      await expect(
        controller.getEntry(mockRequest as any, mockEntryId),
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateDto: UpdateJournalEntryDto = {
      status: WatchStatus.COMPLETED,
    };

    it('should update journal entry for owner', async () => {
      // Arrange
      journalService.update.mockResolvedValue({
        success: true,
        data: { ...mockJournalEntry, status: WatchStatus.COMPLETED },
      });

      // Act
      const result = await controller.update(
        mockRequest as any,
        mockEntryId,
        updateDto,
      );

      // Assert
      expect(journalService.update).toHaveBeenCalledWith(
        mockEntryId,
        mockUserId,
        updateDto,
      );
      expect(result.status).toBe(WatchStatus.COMPLETED);
    });

    it('should update rating independently', async () => {
      // Arrange
      const ratingDto: UpdateJournalEntryDto = { rating: 5.0 };
      journalService.update.mockResolvedValue({
        success: true,
        data: { ...mockJournalEntry, rating: 5.0 },
      });

      // Act
      const result = await controller.update(
        mockRequest as any,
        mockEntryId,
        ratingDto,
      );

      // Assert
      expect(result.rating).toBe(5.0);
    });

    it('should throw error for non-owned entry', async () => {
      // Arrange
      journalService.update.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.USER_NOT_FOUND,
          message: 'Entry not found',
        },
      });

      // Act & Assert
      await expect(
        controller.update(mockRequest as any, mockEntryId, updateDto),
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete journal entry for owner', async () => {
      // Arrange
      journalService.delete.mockResolvedValue({
        success: true,
        data: undefined,
      });

      // Act
      await controller.delete(mockRequest as any, mockEntryId);

      // Assert
      expect(journalService.delete).toHaveBeenCalledWith(
        mockEntryId,
        mockUserId,
      );
    });

    it('should throw error for non-owned entry', async () => {
      // Arrange
      journalService.delete.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.USER_NOT_FOUND,
          message: 'Entry not found',
        },
      });

      // Act & Assert
      await expect(
        controller.delete(mockRequest as any, mockEntryId),
      ).rejects.toThrow();
    });
  });
});
