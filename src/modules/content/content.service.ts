import { Injectable } from '@nestjs/common';
import { BaseService, Result } from '../../common/services/base.service';
import { ContentRepository } from './content.repository';
import {
  ContentEntity,
  toContentEntity,
  ContentPrismaPayload,
} from './entities';
import { QueryContentDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { Content } from '@prisma/client';

@Injectable()
export class ContentService extends BaseService {
  constructor(private readonly contentRepository: ContentRepository) {
    super();
  }

  async browse(
    query: QueryContentDto,
  ): Promise<Result<PaginatedResponseDto<ContentEntity>>> {
    const genres = query.genres
      ? query.genres.split(',').map((g) => g.trim())
      : [];

    const result = await this.contentRepository.findPaginatedContent({
      page: query.page,
      limit: query.limit,
      type: query.type === 'ALL' ? undefined : query.type,
      genres,
      sort: query.sort,
      order: query.order,
    });

    const contentIds = result.items.map((item) => item.id);
    const avgRatings =
      await this.contentRepository.getAverageRatings(contentIds);

    const entities = result.items.map((item) => {
      const payload = item as unknown as ContentPrismaPayload;
      const entity = toContentEntity(item);
      entity.avgRating = avgRatings[item.id] || 0;
      entity.loggedCount = payload._count?.journalEntries || 0;
      return entity;
    });

    return this.success(
      new PaginatedResponseDto<ContentEntity>(
        entities,
        result.meta.total,
        result.meta.page,
        result.meta.limit,
      ),
    );
  }

  async search(
    q: string,
    limit: number = 10,
  ): Promise<Result<{ items: ContentEntity[] }>> {
    const items = await this.contentRepository.searchByTitle(q, limit);
    const contentIds = items.map((item) => item.id);
    const avgRatings =
      await this.contentRepository.getAverageRatings(contentIds);

    const entities = items.map((item) => {
      const payload = item as unknown as ContentPrismaPayload;
      const entity = toContentEntity(item);
      entity.avgRating = avgRatings[item.id] || 0;
      entity.loggedCount = payload._count?.journalEntries || 0;
      return entity;
    });

    return this.success({ items: entities });
  }

  async getDetail(
    slug: string,
    userId?: string,
  ): Promise<Result<ContentEntity>> {
    let content: Content | null;
    if (userId) {
      content = await this.contentRepository.findBySlugWithUserEntry(
        slug,
        userId,
      );
    } else {
      content = await this.contentRepository.findBySlug(slug);
    }

    if (!content) {
      return this.notFound('Content not found', ErrorCode.USER_NOT_FOUND);
    }

    const payload = content as unknown as ContentPrismaPayload;
    const avgRatings = await this.contentRepository.getAverageRatings([
      content.id,
    ]);
    const entity = toContentEntity(content);
    entity.avgRating = avgRatings[content.id] || 0;
    entity.loggedCount = payload._count?.journalEntries || 0;

    if (payload.journalEntries && payload.journalEntries.length > 0) {
      entity.userEntry = payload.journalEntries[0];
    } else {
      entity.userEntry = null;
    }

    return this.success(entity);
  }

  async getFeatured(): Promise<
    Result<{
      featured: ContentEntity[];
      recentlyAdded: ContentEntity[];
      topRated: ContentEntity[];
    }>
  > {
    const [featured, recentlyAdded, topRated] = await Promise.all([
      this.contentRepository.findFeatured(),
      this.contentRepository.findRecentlyAdded(),
      this.contentRepository.findTopRated(),
    ]);

    const allItems = [...featured, ...recentlyAdded, ...topRated];
    const contentIds = Array.from(new Set(allItems.map((item) => item.id)));
    const avgRatings =
      await this.contentRepository.getAverageRatings(contentIds);

    const mapToEntity = (item: Content) => {
      const payload = item as unknown as ContentPrismaPayload;
      const entity = toContentEntity(item);
      entity.avgRating = avgRatings[payload.id] || 0;
      entity.loggedCount = payload._count?.journalEntries || 0;
      return entity;
    };

    return this.success({
      featured: featured.map(mapToEntity),
      recentlyAdded: recentlyAdded.map(mapToEntity),
      topRated: topRated.map(mapToEntity),
    });
  }
}
