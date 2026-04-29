/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ContentRepository } from './content.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentType } from '@prisma/client';

describe('ContentRepository', () => {
  let repository: ContentRepository;
  let prismaService: {
    content: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
    journalEntry: {
      groupBy: jest.Mock;
    };
    $queryRaw: jest.Mock;
  };

  const mockContent = {
    id: 'content-uuid-1234',
    title: 'Crash Landing on You',
    slug: 'crash-landing-on-you',
    type: ContentType.DRAMA,
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
    _count: { journalEntries: 100 },
  };

  const mockMovieContent = {
    id: 'content-uuid-5678',
    title: 'Parasite',
    slug: 'parasite',
    type: ContentType.MOVIE,
    year: 2019,
    synopsis: 'A poor family schemes to become employed by a wealthy family.',
    posterUrl: 'https://example.com/parasite.jpg',
    genres: ['Thriller', 'Drama'],
    cast: 'Song Kang-ho, Lee Sun-kyun',
    episodes: null,
    durationMinutes: 132,
    country: 'South Korea',
    isFeatured: false,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    _count: { journalEntries: 50 },
  };

  beforeEach(async () => {
    prismaService = {
      content: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      journalEntry: {
        groupBy: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentRepository,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    repository = module.get<ContentRepository>(ContentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findBySlug', () => {
    it('should return content by slug', async () => {
      // Arrange
      prismaService.content.findUnique.mockResolvedValue(mockContent);

      // Act
      const result = await repository.findBySlug('crash-landing-on-you');

      // Assert
      expect(prismaService.content.findUnique).toHaveBeenCalledWith({
        where: { slug: 'crash-landing-on-you' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockContent);
    });

    it('should return null for non-existent slug', async () => {
      // Arrange
      prismaService.content.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findBySlug('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findBySlugWithUserEntry', () => {
    const userId = 'user-uuid-1234';

    it('should return content with user entry when exists', async () => {
      // Arrange
      const contentWithEntry = {
        ...mockContent,
        journalEntries: [{ id: 'entry-uuid', userId, rating: 4.5 }],
      } as any;
      prismaService.content.findUnique.mockResolvedValue(contentWithEntry);

      // Act
      const result = await repository.findBySlugWithUserEntry(
        'crash-landing-on-you',
        userId,
      );

      // Assert
      expect(prismaService.content.findUnique).toHaveBeenCalledWith({
        where: { slug: 'crash-landing-on-you' },
        include: expect.objectContaining({
          journalEntries: expect.any(Object),
        }),
      });
      expect(result).toBeDefined();
    });

    it('should return content without user entry when not logged', async () => {
      // Arrange
      const contentWithoutEntry = {
        ...mockContent,
        journalEntries: [],
      } as any;
      prismaService.content.findUnique.mockResolvedValue(contentWithoutEntry);

      // Act
      const result = await repository.findBySlugWithUserEntry(
        'crash-landing-on-you',
        userId,
      );

      // Assert
      expect((result as any)?.journalEntries).toHaveLength(0);
    });
  });

  describe('findByIdWithUserEntry', () => {
    const userId = 'user-uuid-1234';

    it('should return content by id with user entry', async () => {
      // Arrange
      const contentWithEntry = {
        ...mockContent,
        journalEntries: [{ id: 'entry-uuid', userId }],
      } as any;
      prismaService.content.findUnique.mockResolvedValue(contentWithEntry);

      // Act
      const result = await repository.findByIdWithUserEntry(
        'content-uuid-1234',
        userId,
      );

      // Assert
      expect(prismaService.content.findUnique).toHaveBeenCalledWith({
        where: { id: 'content-uuid-1234' },
        include: expect.objectContaining({
          journalEntries: expect.any(Object),
        }),
      });
      expect(result).toBeDefined();
    });
  });

  describe('findPaginatedContent', () => {
    it('should return paginated content with default options', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);
      prismaService.content.count.mockResolvedValue(1);

      // Act
      const result = await repository.findPaginatedContent({});

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
    });

    it('should filter by type DRAMA', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);
      prismaService.content.count.mockResolvedValue(1);

      // Act
      await repository.findPaginatedContent({ type: ContentType.DRAMA });

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: ContentType.DRAMA }),
        }),
      );
    });

    it('should filter by type MOVIE', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockMovieContent]);
      prismaService.content.count.mockResolvedValue(1);

      // Act
      await repository.findPaginatedContent({ type: ContentType.MOVIE });

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: ContentType.MOVIE }),
        }),
      );
    });

    it('should sort by title ascending', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);
      prismaService.content.count.mockResolvedValue(1);

      // Act
      await repository.findPaginatedContent({ sort: 'title', order: 'asc' });

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { title: 'asc' },
        }),
      );
    });

    it('should sort by year descending', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);
      prismaService.content.count.mockResolvedValue(1);

      // Act
      await repository.findPaginatedContent({ sort: 'year', order: 'desc' });

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { year: 'desc' },
        }),
      );
    });

    it('should enforce pagination limits', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([]);
      prismaService.content.count.mockResolvedValue(0);

      // Act
      const result = await repository.findPaginatedContent({ limit: 200 });

      // Assert - limit should be capped at 100
      expect(result.meta.limit).toBe(100);
    });

    it('should handle page 2 pagination', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);
      prismaService.content.count.mockResolvedValue(25);

      // Act
      const result = await repository.findPaginatedContent({
        page: 2,
        limit: 20,
      });

      // Assert
      expect(result.meta.page).toBe(2);
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
        }),
      );
    });
  });

  describe('searchByTitle', () => {
    it('should return matching content by partial title', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);

      // Act
      const result = await repository.searchByTitle('Crash');

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            title: {
              contains: 'Crash',
              mode: 'insensitive',
            },
          },
        }),
      );
      expect(result).toHaveLength(1);
    });

    it('should limit results to specified limit', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);

      // Act
      await repository.searchByTitle('test', 5);

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });

    it('should return empty array for no matches', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.searchByTitle('nonexistent');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('findFeatured', () => {
    it('should return featured content', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);

      // Act
      const result = await repository.findFeatured();

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith({
        where: { isFeatured: true },
        include: expect.any(Object),
      });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no featured content', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.findFeatured();

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('findRecentlyAdded', () => {
    it('should return recently added content', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([mockContent]);

      // Act
      const result = await repository.findRecentlyAdded(6);

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: expect.any(Object),
      });
      expect(result).toHaveLength(1);
    });

    it('should use default limit of 6', async () => {
      // Arrange
      prismaService.content.findMany.mockResolvedValue([]);

      // Act
      await repository.findRecentlyAdded();

      // Assert
      expect(prismaService.content.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 6,
        }),
      );
    });
  });

  describe('getAverageRatings', () => {
    it('should return average ratings for content', async () => {
      // Arrange
      prismaService.journalEntry.groupBy.mockResolvedValue([
        { contentId: 'content-uuid-1234', _avg: { rating: 4.5 } },
        { contentId: 'content-uuid-5678', _avg: { rating: 4.0 } },
      ]);

      // Act
      const result = await repository.getAverageRatings([
        'content-uuid-1234',
        'content-uuid-5678',
      ]);

      // Assert
      expect(result['content-uuid-1234']).toBe(4.5);
      expect(result['content-uuid-5678']).toBe(4.0);
    });

    it('should return empty object for empty contentIds', async () => {
      // Arrange - groupBy returns empty array for empty contentIds
      prismaService.journalEntry.groupBy.mockResolvedValue([]);

      // Act
      const result = await repository.getAverageRatings([]);

      // Assert
      expect(result).toEqual({});
    });
  });

  describe('findTopRated', () => {
    it('should return top rated content with min ratings', async () => {
      // Arrange
      prismaService.journalEntry.groupBy.mockResolvedValue([
        {
          contentId: 'content-uuid-1234',
          _avg: { rating: 4.8 },
          _count: { _all: 10 },
        },
      ]);
      prismaService.content.findMany.mockResolvedValue([mockContent]);

      // Act
      const result = await repository.findTopRated(10, 5);

      // Assert
      expect(prismaService.journalEntry.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          having: {
            rating: {
              _count: {
                gte: 5,
              },
            },
          },
        }),
      );
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no content meets min ratings', async () => {
      // Arrange
      prismaService.journalEntry.groupBy.mockResolvedValue([]);

      // Act
      const result = await repository.findTopRated(10, 100);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should use default limit of 10', async () => {
      // Arrange
      prismaService.journalEntry.groupBy.mockResolvedValue([]);

      // Act
      await repository.findTopRated();

      // Assert
      expect(prismaService.journalEntry.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });
  });
});
