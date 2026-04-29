import { Injectable, Inject, Optional } from '@nestjs/common';
import { Prisma, Content, ContentType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BaseRepository,
  PRISMA_TRANSACTION,
} from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

export const CONTENT_INCLUDE = {
  _count: {
    select: {
      journalEntries: true,
    },
  },
} as const;

@Injectable()
export class ContentRepository extends BaseRepository<
  Content,
  Prisma.ContentCreateInput,
  Prisma.ContentUpdateInput,
  Prisma.ContentWhereUniqueInput,
  Prisma.ContentWhereInput,
  Prisma.ContentDelegate
> {
  constructor(
    prismaService: PrismaService,
    @Optional()
    @Inject(PRISMA_TRANSACTION)
    transactionClient?: unknown,
  ) {
    super(prismaService, transactionClient);
  }

  protected getModel(): Prisma.ContentDelegate {
    return this.prismaService.content;
  }

  async findBySlug(slug: string): Promise<Content | null> {
    return this.withRetry(
      () =>
        this.getClient().findUnique({
          where: { slug },
          include: CONTENT_INCLUDE,
        }),
      'findBySlug',
    );
  }

  async findBySlugWithUserEntry(
    slug: string,
    userId: string,
  ): Promise<Content | null> {
    return this.withRetry(
      () =>
        this.getClient().findUnique({
          where: { slug },
          include: {
            ...CONTENT_INCLUDE,
            journalEntries: {
              where: { userId },
              take: 1,
            },
          },
        }) as Promise<Content | null>,
      'findBySlugWithUserEntry',
    );
  }

  async findByIdWithUserEntry(
    id: string,
    userId: string,
  ): Promise<Content | null> {
    return this.withRetry(
      () =>
        this.getClient().findUnique({
          where: { id },
          include: {
            ...CONTENT_INCLUDE,
            journalEntries: {
              where: { userId },
              take: 1,
            },
          },
        }) as Promise<Content | null>,
      'findByIdWithUserEntry',
    );
  }

  async findPaginatedContent(options: {
    page?: number;
    limit?: number;
    type?: ContentType;
    genres?: string[];
    sort?: 'title' | 'year' | 'rating';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponseDto<Content>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(1, options.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const { type, genres, sort = 'title', order = 'asc' } = options;

    const where: Prisma.ContentWhereInput = {
      ...(type && (type as string) !== 'ALL' && { type: type }),
      ...(genres &&
        genres.length > 0 && {
          AND: genres.map((genre) => ({
            genres: {
              array_contains: genre,
            },
          })),
        }),
    };

    let orderBy: Prisma.ContentOrderByWithRelationInput = {};
    if (sort === 'title') {
      orderBy = { title: order };
    } else if (sort === 'year') {
      orderBy = { year: order };
    } else if (sort === 'rating') {
      return this.findPaginatedWithRatingSort({
        where,
        page,
        limit,
        order,
        type,
        genres,
      });
    }

    const [items, total] = await Promise.all([
      this.withRetry(
        () =>
          this.getClient().findMany({
            where,
            include: CONTENT_INCLUDE,
            orderBy,
            skip,
            take: limit,
          }),
        'findPaginatedContent.items',
      ),
      this.withRetry(
        () => this.getClient().count({ where }),
        'findPaginatedContent.count',
      ),
    ]);

    return new PaginatedResponseDto<Content>(items, total, page, limit);
  }

  async searchByTitle(q: string, limit: number = 10): Promise<Content[]> {
    return this.withRetry(
      () =>
        this.getClient().findMany({
          where: {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          },
          take: limit,
          include: CONTENT_INCLUDE,
        }),
      'searchByTitle',
    );
  }

  async findFeatured(): Promise<Content[]> {
    return this.withRetry(
      () =>
        this.getClient().findMany({
          where: { isFeatured: true },
          include: CONTENT_INCLUDE,
        }),
      'findFeatured',
    );
  }

  async findRecentlyAdded(limit: number = 6): Promise<Content[]> {
    return this.withRetry(
      () =>
        this.getClient().findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
          include: CONTENT_INCLUDE,
        }),
      'findRecentlyAdded',
    );
  }

  private async findPaginatedWithRatingSort(options: {
    where: Prisma.ContentWhereInput;
    page: number;
    limit: number;
    order: 'asc' | 'desc';
    type?: ContentType;
    genres?: string[];
  }): Promise<PaginatedResponseDto<Content>> {
    const { page, limit, order, type, genres } = options;
    const skip = (page - 1) * limit;

    const whereConditions: string[] = [];
    if (type && (type as string) !== 'ALL') {
      whereConditions.push(`c.type = '${type}'`);
    }
    if (genres && genres.length > 0) {
      for (const genre of genres) {
        whereConditions.push(`c.genres @> '["${genre}"]'::jsonb`);
      }
    }

    const whereClause =
      whereConditions.length > 0
        ? Prisma.raw(`WHERE ${whereConditions.join(' AND ')}`)
        : Prisma.empty;

    const items = await this.prismaService.$queryRaw<Content[]>`
      SELECT c.*
      FROM "Content" c
      LEFT JOIN "JournalEntry" j ON c.id = j."contentId"
      ${whereClause}
      GROUP BY c.id
      ORDER BY AVG(j.rating) ${Prisma.raw(order)} NULLS LAST
      LIMIT ${limit} OFFSET ${skip}
    `;

    const total = await this.getClient().count({ where: options.where });

    return new PaginatedResponseDto<Content>(items, total, page, limit);
  }

  async getAverageRatings(
    contentIds: string[],
  ): Promise<Record<string, number>> {
    const averages = await this.prismaService.journalEntry.groupBy({
      by: ['contentId'],
      where: {
        contentId: { in: contentIds },
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    });

    const result: Record<string, number> = {};
    for (const avg of averages) {
      result[avg.contentId] = Number(avg._avg.rating) || 0;
    }
    return result;
  }

  async findTopRated(
    limit: number = 10,
    minRatings: number = 5,
  ): Promise<Content[]> {
    const topRatedGroups = await this.prismaService.journalEntry.groupBy({
      by: ['contentId'],
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
      having: {
        rating: {
          _count: {
            gte: minRatings,
          },
        },
      },
      orderBy: {
        _avg: {
          rating: 'desc',
        },
      },
      take: limit,
    });

    const contentIds = topRatedGroups.map((g) => g.contentId);

    if (contentIds.length === 0) {
      return [];
    }

    const contents = await this.getClient().findMany({
      where: { id: { in: contentIds } },
      include: CONTENT_INCLUDE,
    });

    const orderedContents: Content[] = [];
    for (const id of contentIds) {
      const content = contents.find((c) => c.id === id);
      if (content) {
        orderedContents.push(content);
      }
    }

    return orderedContents;
  }
}
