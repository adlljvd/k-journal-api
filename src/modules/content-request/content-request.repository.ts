import { Injectable, Inject, Optional } from '@nestjs/common';
import { Prisma, ContentRequest, RequestStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BaseRepository,
  PRISMA_TRANSACTION,
} from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class ContentRequestRepository extends BaseRepository<
  ContentRequest,
  Prisma.ContentRequestCreateInput,
  Prisma.ContentRequestUpdateInput,
  Prisma.ContentRequestWhereUniqueInput,
  Prisma.ContentRequestWhereInput,
  Prisma.ContentRequestDelegate
> {
  constructor(
    prismaService: PrismaService,
    @Optional()
    @Inject(PRISMA_TRANSACTION)
    transactionClient?: unknown,
  ) {
    super(prismaService, transactionClient);
  }

  protected getModel(): Prisma.ContentRequestDelegate {
    return this.prismaService.contentRequest;
  }

  /**
   * Find all content requests by user ID with pagination and status filter.
   */
  async findByUserId(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: RequestStatus | 'ALL';
    },
  ): Promise<PaginatedResponseDto<ContentRequest>> {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.min(Math.max(1, options?.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ContentRequestWhereInput = {
      userId,
      ...(options?.status &&
        options.status !== 'ALL' && { status: options.status }),
    };

    const [items, total] = await Promise.all([
      this.withRetry(
        () =>
          this.getClient().findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
        'findByUserId.items',
      ),
      this.withRetry(
        () => this.getClient().count({ where }),
        'findByUserId.count',
      ),
    ]);

    return new PaginatedResponseDto<ContentRequest>(items, total, page, limit);
  }

  /**
   * Find all content requests with pagination and status filter (admin view).
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: RequestStatus | 'ALL';
  }): Promise<PaginatedResponseDto<ContentRequest>> {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.min(Math.max(1, options?.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ContentRequestWhereInput = {
      ...(options?.status &&
        options.status !== 'ALL' && { status: options.status }),
    };

    const [items, total] = await Promise.all([
      this.withRetry(
        () =>
          this.getClient().findMany({
            where,
            orderBy: { createdAt: 'asc' }, // Oldest first for admin review
            skip,
            take: limit,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          }),
        'findAll.items',
      ),
      this.withRetry(() => this.getClient().count({ where }), 'findAll.count'),
    ]);

    return new PaginatedResponseDto<ContentRequest>(items, total, page, limit);
  }

  /**
   * Count content requests by user created today.
   * Used for rate limiting (5 requests per user per day).
   */
  async countByUserToday(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.withRetry(
      () =>
        this.getClient().count({
          where: {
            userId,
            createdAt: {
              gte: today,
            },
          },
        }),
      'countByUserToday',
    );
  }

  /**
   * Check if a request with the same title already exists for this user.
   */
  async findByUserAndTitle(
    userId: string,
    title: string,
  ): Promise<ContentRequest | null> {
    return this.withRetry(
      () =>
        this.getClient().findFirst({
          where: {
            userId,
            title: {
              equals: title,
              mode: 'insensitive',
            },
          },
        }),
      'findByUserAndTitle',
    );
  }

  /**
   * Update the status of a content request.
   */
  async updateStatus(
    id: string,
    data: {
      status: RequestStatus;
      rejectionReason?: string;
      contentId?: string;
      reviewedBy?: string;
      reviewedAt?: Date;
    },
  ): Promise<ContentRequest> {
    return this.update({ id }, data);
  }

  /**
   * Find pending requests count.
   */
  async countPending(): Promise<number> {
    return this.withRetry(
      () =>
        this.getClient().count({
          where: { status: RequestStatus.PENDING },
        }),
      'countPending',
    );
  }

  /**
   * Find recent requests for admin dashboard.
   */
  async findRecent(limit: number = 5): Promise<ContentRequest[]> {
    return this.withRetry(
      () =>
        this.getClient().findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
        }),
      'findRecent',
    );
  }
}
