/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { JournalRepository, JOURNAL_ENTRY_INCLUDE } from './journal.repository';
import { WatchStatus } from '../../common/enums/watch-status.enum';

describe('JournalRepository', () => {
  let repository: JournalRepository;
  let prismaService: {
    journalEntry: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
      aggregate: jest.Mock;
    };
  };

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
  };

  beforeEach(async () => {
    prismaService = {
      journalEntry: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalRepository,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    repository = module.get<JournalRepository>(JournalRepository);

    jest.clearAllMocks();
  });

  describe('findByUserAndContent', () => {
    it('should return entry when found', async () => {
      // Arrange
      prismaService.journalEntry.findUnique.mockResolvedValue(mockJournalEntry);

      // Act
      const result = await repository.findByUserAndContent(
        mockUserId,
        mockContentId,
      );

      // Assert
      expect(result).toEqual(mockJournalEntry);
      expect(prismaService.journalEntry.findUnique).toHaveBeenCalledWith({
        where: {
          userId_contentId: {
            userId: mockUserId,
            contentId: mockContentId,
          },
        },
        include: JOURNAL_ENTRY_INCLUDE,
      });
    });

    it('should return null when not found', async () => {
      // Arrange
      prismaService.journalEntry.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByUserAndContent(
        mockUserId,
        mockContentId,
      );

      // Assert
      expect(result).toBeNull();
    });

    it('should use unique constraint on (userId, contentId)', async () => {
      // Arrange
      prismaService.journalEntry.findUnique.mockResolvedValue(mockJournalEntry);

      // Act
      await repository.findByUserAndContent(mockUserId, mockContentId);

      // Assert
      expect(prismaService.journalEntry.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId_contentId: {
              userId: mockUserId,
              contentId: mockContentId,
            },
          },
        }),
      );
    });
  });

  describe('findByIdWithOwner', () => {
    it('should return entry when id and userId match', async () => {
      // Arrange
      prismaService.journalEntry.findUnique.mockResolvedValue(mockJournalEntry);

      // Act
      const result = await repository.findByIdWithOwner(
        mockEntryId,
        mockUserId,
      );

      // Assert
      expect(result).toEqual(mockJournalEntry);
      expect(prismaService.journalEntry.findUnique).toHaveBeenCalledWith({
        where: { id: mockEntryId, userId: mockUserId },
        include: JOURNAL_ENTRY_INCLUDE,
      });
    });

    it('should return null when entry does not belong to user', async () => {
      // Arrange
      prismaService.journalEntry.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByIdWithOwner(
        mockEntryId,
        'different-user-id',
      );

      // Assert
      expect(result).toBeNull();
    });

    it('should enforce ownership check (P0-JRN-002)', async () => {
      // Arrange
      prismaService.journalEntry.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByIdWithOwner(
        mockEntryId,
        'different-user-id',
      );

      // Assert - findUnique with compound where clause ensures ownership
      expect(result).toBeNull();
      expect(prismaService.journalEntry.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: mockEntryId,
            userId: 'different-user-id',
          }),
        }),
      );
    });
  });

  describe('findPaginatedByUser', () => {
    const mockEntries = [
      mockJournalEntry,
      { ...mockJournalEntry, id: 'entry-2', rating: 3.5 },
    ];

    it('should return paginated entries with default values', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(2);

      // Act
      const result = await repository.findPaginatedByUser({
        userId: mockUserId,
      });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
    });

    it('should filter by WATCHING status', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue([mockJournalEntry]);
      prismaService.journalEntry.count.mockResolvedValue(1);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        status: WatchStatus.WATCHING,
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: WatchStatus.WATCHING,
          }),
        }),
      );
    });

    it('should filter by COMPLETED status', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue([]);
      prismaService.journalEntry.count.mockResolvedValue(0);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        status: WatchStatus.COMPLETED,
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: WatchStatus.COMPLETED,
          }),
        }),
      );
    });

    it('should not filter when status is ALL', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(2);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        status: 'ALL',
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId },
        }),
      );
    });

    it('should sort by updatedAt descending (default)', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(2);

      // Act
      await repository.findPaginatedByUser({ userId: mockUserId });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { updatedAt: 'desc' },
        }),
      );
    });

    it('should sort by createdAt ascending', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(2);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        sort: 'createdAt',
        order: 'asc',
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'asc' },
        }),
      );
    });

    it('should sort by rating descending', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(2);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        sort: 'rating',
        order: 'desc',
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { rating: 'desc' },
        }),
      );
    });

    it('should sort by title ascending (via content relation)', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(2);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        sort: 'title',
        order: 'asc',
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { content: { title: 'asc' } },
        }),
      );
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(50);

      // Act
      await repository.findPaginatedByUser({
        userId: mockUserId,
        page: 2,
        limit: 10,
      });

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('should cap limit at 100', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(200);

      // Act
      const result = await repository.findPaginatedByUser({
        userId: mockUserId,
        limit: 150,
      });

      // Assert
      expect(result.meta.limit).toBe(100);
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        }),
      );
    });

    it('should return correct totalPages', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue(mockEntries);
      prismaService.journalEntry.count.mockResolvedValue(45);

      // Act
      const result = await repository.findPaginatedByUser({
        userId: mockUserId,
        limit: 20,
      });

      // Assert
      expect(result.meta.totalPages).toBe(3);
    });
  });

  describe('findByFavorites', () => {
    it('should return entries with isFavorite=true', async () => {
      // Arrange
      const favoriteEntries = [
        { ...mockJournalEntry, isFavorite: true },
        { ...mockJournalEntry, id: 'entry-2', isFavorite: true },
      ];
      prismaService.journalEntry.findMany.mockResolvedValue(favoriteEntries);

      // Act
      const result = await repository.findByFavorites(mockUserId);

      // Assert
      expect(result).toHaveLength(2);
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: mockUserId,
            isFavorite: true,
          },
        }),
      );
    });

    it('should return empty array when no favorites', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.findByFavorites(mockUserId);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should sort by updatedAt descending', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue([]);

      // Act
      await repository.findByFavorites(mockUserId);

      // Assert
      expect(prismaService.journalEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { updatedAt: 'desc' },
        }),
      );
    });
  });

  describe('countTotalByUser', () => {
    it('should return total count of entries for user', async () => {
      // Arrange
      prismaService.journalEntry.count.mockResolvedValue(15);

      // Act
      const result = await repository.countTotalByUser(mockUserId);

      // Assert
      expect(result).toBe(15);
    });

    it('should return 0 when no entries', async () => {
      // Arrange
      prismaService.journalEntry.count.mockResolvedValue(0);

      // Act
      const result = await repository.countTotalByUser(mockUserId);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('countRatedByUser', () => {
    it('should return count of entries with non-null rating', async () => {
      // Arrange
      prismaService.journalEntry.count.mockResolvedValue(8);

      // Act
      const result = await repository.countRatedByUser(mockUserId);

      // Assert
      expect(result).toBe(8);
      expect(prismaService.journalEntry.count).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          rating: { not: null },
        },
      });
    });

    it('should return 0 when no rated entries', async () => {
      // Arrange
      prismaService.journalEntry.count.mockResolvedValue(0);

      // Act
      const result = await repository.countRatedByUser(mockUserId);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('countFavoritesByUser', () => {
    it('should return count of entries with isFavorite=true', async () => {
      // Arrange
      prismaService.journalEntry.count.mockResolvedValue(3);

      // Act
      const result = await repository.countFavoritesByUser(mockUserId);

      // Assert
      expect(result).toBe(3);
      expect(prismaService.journalEntry.count).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          isFavorite: true,
        },
      });
    });

    it('should return 0 when no favorites', async () => {
      // Arrange
      prismaService.journalEntry.count.mockResolvedValue(0);

      // Act
      const result = await repository.countFavoritesByUser(mockUserId);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('getMeanRatingByUser', () => {
    it('should return mean rating for user', async () => {
      // Arrange
      prismaService.journalEntry.aggregate.mockResolvedValue({
        _avg: { rating: 4.2 },
      });

      // Act
      const result = await repository.getMeanRatingByUser(mockUserId);

      // Assert
      expect(result).toBe(4.2);
      expect(prismaService.journalEntry.aggregate).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          rating: { not: null },
        },
        _avg: { rating: true },
      });
    });

    it('should return 0 when no rated entries (null average)', async () => {
      // Arrange
      prismaService.journalEntry.aggregate.mockResolvedValue({
        _avg: { rating: null },
      });

      // Act
      const result = await repository.getMeanRatingByUser(mockUserId);

      // Assert
      expect(result).toBe(0);
    });

    it('should exclude unrated entries from mean calculation', async () => {
      // Arrange
      prismaService.journalEntry.aggregate.mockResolvedValue({
        _avg: { rating: 3.75 },
      });

      // Act
      await repository.getMeanRatingByUser(mockUserId);

      // Assert
      expect(prismaService.journalEntry.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            rating: { not: null },
          }),
        }),
      );
    });
  });

  describe('findMany', () => {
    it('should find entries by criteria', async () => {
      // Arrange
      prismaService.journalEntry.findMany.mockResolvedValue([mockJournalEntry]);

      // Act
      const result = await repository.findMany({
        id: { in: [mockEntryId] },
        userId: mockUserId,
        isFavorite: true,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(prismaService.journalEntry.findMany).toHaveBeenCalled();
    });
  });
});
