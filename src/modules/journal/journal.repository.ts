import { Injectable, Inject, Optional } from '@nestjs/common';
import { Prisma, JournalEntry, WatchStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BaseRepository,
  PRISMA_TRANSACTION,
} from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

export const JOURNAL_ENTRY_INCLUDE = {
  content: true,
} as const;

@Injectable()
export class JournalRepository extends BaseRepository<
  JournalEntry,
  Prisma.JournalEntryCreateInput,
  Prisma.JournalEntryUpdateInput,
  Prisma.JournalEntryWhereUniqueInput,
  Prisma.JournalEntryWhereInput,
  Prisma.JournalEntryDelegate
> {
  constructor(
    prismaService: PrismaService,
    @Optional()
    @Inject(PRISMA_TRANSACTION)
    transactionClient?: unknown,
  ) {
    super(prismaService, transactionClient);
  }

  protected getModel(): Prisma.JournalEntryDelegate {
    return this.prismaService.journalEntry;
  }

  async findByUserAndContent(
    userId: string,
    contentId: string,
  ): Promise<JournalEntry | null> {
    return this.withRetry(
      () =>
        this.getClient().findUnique({
          where: {
            userId_contentId: {
              userId,
              contentId,
            },
          },
          include: JOURNAL_ENTRY_INCLUDE,
        }),
      'findByUserAndContent',
    );
  }

  async findPaginatedByUser(options: {
    userId: string;
    page?: number;
    limit?: number;
    status?: WatchStatus | 'ALL';
    sort?: 'updatedAt' | 'createdAt' | 'rating' | 'title';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponseDto<JournalEntry>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(1, options.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const { userId, status, sort = 'updatedAt', order = 'desc' } = options;

    const where: Prisma.JournalEntryWhereInput = {
      userId,
      ...(status && status !== 'ALL' && { status }),
    };

    let orderBy: Prisma.JournalEntryOrderByWithRelationInput = {};
    if (sort === 'title') {
      orderBy = { content: { title: order } };
    } else {
      orderBy = { [sort]: order };
    }

    const [items, total] = await Promise.all([
      this.withRetry(
        () =>
          this.getClient().findMany({
            where,
            include: JOURNAL_ENTRY_INCLUDE,
            orderBy,
            skip,
            take: limit,
          }),
        'findPaginatedByUser.items',
      ),
      this.withRetry(
        () => this.getClient().count({ where }),
        'findPaginatedByUser.count',
      ),
    ]);

    return new PaginatedResponseDto<JournalEntry>(items, total, page, limit);
  }

  async findByFavorites(userId: string): Promise<JournalEntry[]> {
    return this.withRetry(
      () =>
        this.getClient().findMany({
          where: {
            userId,
            isFavorite: true,
          },
          include: JOURNAL_ENTRY_INCLUDE,
          orderBy: { updatedAt: 'desc' },
        }),
      'findByFavorites',
    );
  }

  async findByIdWithOwner(
    id: string,
    userId: string,
  ): Promise<JournalEntry | null> {
    return this.withRetry(
      () =>
        this.getClient().findUnique({
          where: { id, userId },
          include: JOURNAL_ENTRY_INCLUDE,
        }),
      'findByIdWithOwner',
    );
  }

  async countTotalByUser(userId: string): Promise<number> {
    return this.withRetry(
      () => this.getClient().count({ where: { userId } }),
      'countTotalByUser',
    );
  }

  async countRatedByUser(userId: string): Promise<number> {
    return this.withRetry(
      () =>
        this.getClient().count({
          where: {
            userId,
            rating: { not: null },
          },
        }),
      'countRatedByUser',
    );
  }

  async countFavoritesByUser(userId: string): Promise<number> {
    return this.withRetry(
      () =>
        this.getClient().count({
          where: {
            userId,
            isFavorite: true,
          },
        }),
      'countFavoritesByUser',
    );
  }

  async getMeanRatingByUser(userId: string): Promise<number> {
    const aggregate = await this.prismaService.journalEntry.aggregate({
      where: {
        userId,
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    });

    return Number(aggregate._avg.rating) || 0;
  }
}
