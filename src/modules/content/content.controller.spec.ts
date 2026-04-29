/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentType as PrismaContentType } from '@prisma/client';
import { QueryContentDto, ContentSortBy, SortOrder } from './dto';
import { ContentType } from '../../common/enums/content-type.enum';

describe('ContentController', () => {
  let controller: ContentController;
  let contentService: jest.Mocked<ContentService>;

  const mockContent = {
    id: 'content-uuid-1234',
    title: 'Crash Landing on You',
    slug: 'crash-landing-on-you',
    type: PrismaContentType.DRAMA,
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
    userEntry: null,
  } as any;

  const mockRequest = {
    user: {
      userId: 'user-uuid-1234',
      email: 'test@example.com',
      role: 'USER',
    },
  };

  const mockRequestWithoutUser = {
    user: null,
  };

  beforeEach(async () => {
    const mockContentService = {
      browse: jest.fn(),
      search: jest.fn(),
      getFeatured: jest.fn(),
      getDetail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [{ provide: ContentService, useValue: mockContentService }],
    }).compile();

    controller = module.get<ContentController>(ContentController);
    contentService = module.get(ContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('browse', () => {
    const defaultQuery: QueryContentDto = {
      page: 1,
      limit: 20,
      sort: ContentSortBy.TITLE,
      order: SortOrder.ASC,
    };

    it('should return paginated content list', async () => {
      // Arrange
      contentService.browse.mockResolvedValue({
        success: true,
        data: {
          items: [mockContent],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        },
      });

      // Act
      const result = await controller.browse(defaultQuery);

      // Assert
      expect(contentService.browse).toHaveBeenCalledWith(defaultQuery);
      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by type DRAMA', async () => {
      // Arrange
      const query: QueryContentDto = {
        ...defaultQuery,
        type: ContentType.DRAMA,
      };
      contentService.browse.mockResolvedValue({
        success: true,
        data: {
          items: [mockContent],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        },
      });

      // Act
      await controller.browse(query);

      // Assert
      expect(contentService.browse).toHaveBeenCalledWith(query);
    });

    it('should filter by type MOVIE', async () => {
      // Arrange
      const query: QueryContentDto = {
        ...defaultQuery,
        type: ContentType.MOVIE,
      };
      contentService.browse.mockResolvedValue({
        success: true,
        data: {
          items: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        },
      });

      // Act
      const result = await controller.browse(query);

      // Assert
      expect(result.items).toHaveLength(0);
    });

    it('should sort by title ascending', async () => {
      // Arrange
      const query: QueryContentDto = {
        ...defaultQuery,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      };
      contentService.browse.mockResolvedValue({
        success: true,
        data: {
          items: [mockContent],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        },
      });

      // Act
      await controller.browse(query);

      // Assert
      expect(contentService.browse).toHaveBeenCalledWith(query);
    });

    it('should handle pagination', async () => {
      // Arrange
      const query: QueryContentDto = {
        page: 2,
        limit: 10,
        sort: ContentSortBy.TITLE,
        order: SortOrder.ASC,
      };
      contentService.browse.mockResolvedValue({
        success: true,
        data: {
          items: [],
          meta: { total: 15, page: 2, limit: 10, totalPages: 2 },
        },
      });

      // Act
      const result = await controller.browse(query);

      // Assert
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(10);
    });

    it('should return empty array when no content found', async () => {
      // Arrange
      contentService.browse.mockResolvedValue({
        success: true,
        data: {
          items: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        },
      });

      // Act
      const result = await controller.browse(defaultQuery);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('search', () => {
    it('should return matching content', async () => {
      // Arrange
      contentService.search.mockResolvedValue({
        success: true,
        data: { items: [mockContent] },
      });

      // Act
      const result = await controller.search('Crash');

      // Assert
      expect(contentService.search).toHaveBeenCalledWith('Crash', undefined);
      expect(result.items).toHaveLength(1);
    });

    it('should limit results', async () => {
      // Arrange
      contentService.search.mockResolvedValue({
        success: true,
        data: { items: [mockContent] },
      });

      // Act
      await controller.search('test', 5);

      // Assert
      expect(contentService.search).toHaveBeenCalledWith('test', 5);
    });

    it('should return empty array for no matches', async () => {
      // Arrange
      contentService.search.mockResolvedValue({
        success: true,
        data: { items: [] },
      });

      // Act
      const result = await controller.search('nonexistent');

      // Assert
      expect(result.items).toHaveLength(0);
    });
  });

  describe('getFeatured', () => {
    it('should return featured sections', async () => {
      // Arrange
      contentService.getFeatured.mockResolvedValue({
        success: true,
        data: {
          featured: [mockContent],
          recentlyAdded: [mockContent],
          topRated: [mockContent],
        },
      });

      // Act
      const result = await controller.getFeatured();

      // Assert
      expect(contentService.getFeatured).toHaveBeenCalled();
      expect(result.featured).toHaveLength(1);
      expect(result.recentlyAdded).toHaveLength(1);
      expect(result.topRated).toHaveLength(1);
    });

    it('should return empty arrays when no featured content', async () => {
      // Arrange
      contentService.getFeatured.mockResolvedValue({
        success: true,
        data: {
          featured: [],
          recentlyAdded: [],
          topRated: [],
        },
      });

      // Act
      const result = await controller.getFeatured();

      // Assert
      expect(result.featured).toHaveLength(0);
      expect(result.recentlyAdded).toHaveLength(0);
      expect(result.topRated).toHaveLength(0);
    });
  });

  describe('getDetail', () => {
    it('should return content detail for authenticated user', async () => {
      // Arrange
      const contentWithUserEntry = {
        ...mockContent,
        userEntry: {
          id: 'entry-uuid',
          status: 'WATCHING',
          rating: 4.5,
          review: 'Great show!',
          isFavorite: true,
        },
      };
      contentService.getDetail.mockResolvedValue({
        success: true,
        data: contentWithUserEntry,
      });

      // Act
      const result = await controller.getDetail(
        'crash-landing-on-you',
        mockRequest as any,
      );

      // Assert
      expect(contentService.getDetail).toHaveBeenCalledWith(
        'crash-landing-on-you',
        'user-uuid-1234',
      );
      expect(result.userEntry).toBeDefined();
    });

    it('should return content detail for unauthenticated user', async () => {
      // Arrange
      contentService.getDetail.mockResolvedValue({
        success: true,
        data: mockContent,
      });

      // Act
      const result = await controller.getDetail(
        'crash-landing-on-you',
        mockRequestWithoutUser as any,
      );

      // Assert
      expect(contentService.getDetail).toHaveBeenCalledWith(
        'crash-landing-on-you',
        undefined,
      );
      expect(result.userEntry).toBeNull();
    });

    it('should return content without user entry when not logged', async () => {
      // Arrange
      const contentWithoutEntry = {
        ...mockContent,
        userEntry: null,
      };
      contentService.getDetail.mockResolvedValue({
        success: true,
        data: contentWithoutEntry,
      });

      // Act
      const result = await controller.getDetail(
        'crash-landing-on-you',
        mockRequest as any,
      );

      // Assert
      expect(result.userEntry).toBeNull();
    });

    it('should throw error for non-existent slug', async () => {
      // Arrange
      contentService.getDetail.mockResolvedValue({
        success: false,
        error: {
          code: 'CONTENT_NOT_FOUND' as any,
          message: 'Content not found',
        },
      });

      // Act & Assert
      await expect(
        controller.getDetail('non-existent', mockRequest as any),
      ).rejects.toThrow();
    });
  });
});
