import { Injectable } from '@nestjs/common';
import { BaseService, Result } from '../../common/services/base.service';
import { ContentRequestRepository } from './content-request.repository';
import { ContentRequestEntity, toContentRequestEntity } from './entities';
import { CreateContentRequestDto, QueryContentRequestDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

/**
 * Daily limit for content requests per user (NFR-006)
 */
const DAILY_REQUEST_LIMIT = 5;

@Injectable()
export class ContentRequestService extends BaseService {
  constructor(
    private readonly contentRequestRepository: ContentRequestRepository,
  ) {
    super();
  }

  /**
   * Create a new content request.
   * Validates daily limit and duplicate title.
   */
  async createRequest(
    userId: string,
    dto: CreateContentRequestDto,
  ): Promise<Result<ContentRequestEntity>> {
    // Check daily limit
    const dailyCount =
      await this.contentRequestRepository.countByUserToday(userId);
    if (dailyCount >= DAILY_REQUEST_LIMIT) {
      return this.error(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} content requests.`,
      );
    }

    // Check for duplicate title
    const existingRequest =
      await this.contentRequestRepository.findByUserAndTitle(userId, dto.title);
    if (existingRequest) {
      return this.error(
        ErrorCode.DUPLICATE_REQUEST,
        'You have already submitted a request for this title.',
      );
    }

    // Create the request
    const request = await this.contentRequestRepository.create({
      title: dto.title,
      type: dto.type,
      year: dto.year,
      notes: dto.notes,
      user: {
        connect: { id: userId },
      },
    });

    return this.success(toContentRequestEntity(request));
  }

  /**
   * Get user's content requests with pagination and status filter.
   */
  async getMyRequests(
    userId: string,
    query: QueryContentRequestDto,
  ): Promise<Result<PaginatedResponseDto<ContentRequestEntity>>> {
    const result = await this.contentRequestRepository.findByUserId(userId, {
      page: query.page,
      limit: query.limit,
      status: query.status,
    });

    const entities = result.items.map(toContentRequestEntity);

    return this.success(
      new PaginatedResponseDto<ContentRequestEntity>(
        entities,
        result.meta.total,
        result.meta.page,
        result.meta.limit,
      ),
    );
  }

  /**
   * Check if user is under daily limit.
   */
  async checkDailyLimit(
    userId: string,
  ): Promise<Result<{ remaining: number }>> {
    const count = await this.contentRequestRepository.countByUserToday(userId);
    const remaining = Math.max(0, DAILY_REQUEST_LIMIT - count);
    return this.success({ remaining });
  }
}
