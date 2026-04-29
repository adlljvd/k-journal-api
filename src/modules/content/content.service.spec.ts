/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { ContentRepository } from './content.repository';
import { Content, ContentType as PrismaContentType } from '@prisma/client';
import { ContentType } from '../../common/enums/content-type.enum';
import { ContentSortBy, SortOrder } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ContentEntity } from './entities';
import { ErrorCode } from '../../common/enums/error-code.enum';

describe('ContentService', () => {
  let service: ContentService;
  let repository: jest.Mocked<ContentRepository>;

  const mockContent: Content = {
    id: '1',
    title: 'Test Content',
    slug: 'test-content',
    type: PrismaContentType.DRAMA,
    year: 2024,
    synopsis: 'Synopsis',
    posterUrl: 'https://example.com/poster.jpg',
    genres: ['Drama'],
    cast: 'Cast',
    episodes: 16,
    durationMinutes: null,
    country: 'South Korea',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContentWithCount = {
    ...mockContent,
    _count: { journalEntries: 10 },
  };

  beforeEach(async () => {
    const mockRepository = {
      findPaginatedContent: jest.fn(),
      getAverageRatings: jest.fn(),
      searchByTitle: jest.fn(),
      findBySlug: jest.fn(),
      findBySlugWithUserEntry: jest.fn(),
      findFeatured: jest.fn(),
      findRecentlyAdded: jest.fn(),
      findTopRated: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: ContentRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    repository = module.get(ContentRepository);
  });

  describe('browse', () => {
    it('should return paginated content with default values', async () => {
      const paginatedResult = new PaginatedResponseDto(
        [mockContentWithCount],
        1,
        1,
        20,
      );
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({ '1': 4.5 });

      const result = await service.browse({
        page: 1,
        limit: 20,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0]).toBeInstanceOf(ContentEntity);
        expect(result.data.items[0].avgRating).toBe(4.5);
        expect(result.data.items[0].loggedCount).toBe(10);
        expect(result.data.meta.total).toBe(1);
      }
      expect(repository.findPaginatedContent).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 20 }),
      );
    });

    it('should handle custom page size', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 50);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      await service.browse({
        page: 1,
        limit: 50,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      expect(repository.findPaginatedContent.mock.calls[0][0]).toEqual(
        expect.objectContaining({ limit: 50 }),
      );
    });

    it('should filter by type', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      await service.browse({
        page: 1,
        limit: 20,
        type: ContentType.MOVIE,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      const findPaginatedContent = repository.findPaginatedContent;
      expect(findPaginatedContent).toHaveBeenCalledWith(
        expect.objectContaining({ type: ContentType.MOVIE }),
      );
    });

    it('should handle type ALL', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      await service.browse({
        page: 1,
        limit: 20,
        type: 'ALL',
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      expect(jest.mocked(repository.findPaginatedContent)).toHaveBeenCalledWith(
        expect.objectContaining({ type: undefined }),
      );
    });

    it('should filter by multiple genres', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      await service.browse({
        page: 1,
        limit: 20,
        genres: 'Drama, Romance',
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      expect(jest.mocked(repository.findPaginatedContent)).toHaveBeenCalledWith(
        expect.objectContaining({ genres: ['Drama', 'Romance'] }),
      );
    });

    it('should sort by year descending', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      await service.browse({
        page: 1,
        limit: 20,
        sort: ContentSortBy.YEAR,
        order: SortOrder.DESC,
      });

      expect(jest.mocked(repository.findPaginatedContent)).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'year', order: 'desc' }),
      );
    });

    it('should sort by rating descending', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      await service.browse({
        page: 1,
        limit: 20,
        sort: ContentSortBy.RATING,
        order: SortOrder.DESC,
      });

      expect(jest.mocked(repository.findPaginatedContent)).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'rating', order: 'desc' }),
      );
    });

    it('should handle empty results', async () => {
      const paginatedResult = new PaginatedResponseDto([], 0, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      const result = await service.browse({
        page: 1,
        limit: 20,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(0);
        expect(result.data.meta.total).toBe(0);
      }
    });

    it('should handle missing ratings and counts', async () => {
      const paginatedResult = new PaginatedResponseDto([mockContent], 1, 1, 20);
      repository.findPaginatedContent.mockResolvedValue(paginatedResult);
      repository.getAverageRatings.mockResolvedValue({});

      const result = await service.browse({
        page: 1,
        limit: 20,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items[0].avgRating).toBe(0);
        expect(result.data.items[0].loggedCount).toBe(0);
      }
    });
  });

  describe('search', () => {
    it('should return matching content', async () => {
      repository.searchByTitle.mockResolvedValue([mockContentWithCount]);
      repository.getAverageRatings.mockResolvedValue({ '1': 4.5 });

      const result = await service.search('Test');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0].title).toBe('Test Content');
      }
      expect(jest.mocked(repository.searchByTitle)).toHaveBeenCalledWith(
        'Test',
        10,
      );
    });

    it('should return empty array for no matches', async () => {
      repository.searchByTitle.mockResolvedValue([]);

      const result = await service.search('NonExistent');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(0);
      }
    });

    it('should handle missing ratings and counts in search', async () => {
      repository.searchByTitle.mockResolvedValue([mockContent]);
      repository.getAverageRatings.mockResolvedValue({});

      const result = await service.search('Test');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items[0].avgRating).toBe(0);
        expect(result.data.items[0].loggedCount).toBe(0);
      }
    });
  });

  describe('getDetail', () => {
    it('should return content detail by slug', async () => {
      repository.findBySlug.mockResolvedValue(mockContentWithCount);
      repository.getAverageRatings.mockResolvedValue({ '1': 4.5 });

      const result = await service.getDetail('test-content');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe('test-content');
        expect(result.data.avgRating).toBe(4.5);
      }
    });

    it('should return content detail with user entry if authenticated', async () => {
      const mockContentWithEntry = {
        ...mockContentWithCount,
        journalEntries: [{ id: 'entry-1', status: 'WATCHING' }],
      };
      repository.findBySlugWithUserEntry.mockResolvedValue(
        mockContentWithEntry,
      );
      repository.getAverageRatings.mockResolvedValue({ '1': 4.5 });

      const result = await service.getDetail('test-content', 'user-1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userEntry).toBeDefined();
      }
      expect(
        jest.mocked(repository.findBySlugWithUserEntry),
      ).toHaveBeenCalledWith('test-content', 'user-1');
    });

    it('should return null userEntry for authenticated user without entry', async () => {
      repository.findBySlugWithUserEntry.mockResolvedValue(
        mockContentWithCount,
      );
      repository.getAverageRatings.mockResolvedValue({ '1': 4.5 });

      const result = await service.getDetail('test-content', 'user-1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userEntry).toBeNull();
      }
    });

    it('should handle missing ratings and counts in getDetail', async () => {
      repository.findBySlug.mockResolvedValue(mockContent);
      repository.getAverageRatings.mockResolvedValue({});

      const result = await service.getDetail('test-content');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.avgRating).toBe(0);
        expect(result.data.loggedCount).toBe(0);
      }
    });

    it('should return 404 if content not found', async () => {
      repository.findBySlug.mockResolvedValue(null);

      const result = await service.getDetail('non-existent');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
      }
    });
  });

  describe('getFeatured', () => {
    it('should return featured, recently added and top rated content', async () => {
      repository.findFeatured.mockResolvedValue([mockContentWithCount]);
      repository.findRecentlyAdded.mockResolvedValue([mockContentWithCount]);
      repository.findTopRated.mockResolvedValue([mockContentWithCount]);
      repository.getAverageRatings.mockResolvedValue({ '1': 4.5 });

      const result = await service.getFeatured();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toHaveLength(1);
        expect(result.data.recentlyAdded).toHaveLength(1);
        expect(result.data.topRated).toHaveLength(1);

        const item = result.data.featured[0];
        expect(item.title).toBe('Test Content');
        expect(item.posterUrl).toBe('https://example.com/poster.jpg');
        expect(item.type).toBe(PrismaContentType.DRAMA);
        expect(item.avgRating).toBe(4.5);
        expect(item.loggedCount).toBe(10);
      }
    });

    it('should handle missing ratings and counts in getFeatured', async () => {
      repository.findFeatured.mockResolvedValue([mockContent]);
      repository.findRecentlyAdded.mockResolvedValue([mockContent]);
      repository.findTopRated.mockResolvedValue([mockContent]);
      repository.getAverageRatings.mockResolvedValue({});

      const result = await service.getFeatured();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured[0].avgRating).toBe(0);
        expect(result.data.featured[0].loggedCount).toBe(0);
      }
    });
  });
});
