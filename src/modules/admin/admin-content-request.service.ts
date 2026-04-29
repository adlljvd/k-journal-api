import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContentRequestRepository } from '../content-request/content-request.repository';
import { ContentRepository } from '../content/content.repository';
import { AdminContentService } from './admin-content.service';
import { ApproveRequestDto, RejectRequestDto } from './dto';
import {
  ContentRequestEntity,
  toContentRequestEntity,
} from '../content-request/entities';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { Prisma, RequestStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminContentRequestService {
  constructor(
    private readonly contentRequestRepository: ContentRequestRepository,
    private readonly contentRepository: ContentRepository,
    private readonly adminContentService: AdminContentService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAllRequests(query: {
    page?: number;
    limit?: number;
    status?: RequestStatus | 'ALL';
  }): Promise<PaginatedResponseDto<ContentRequestEntity>> {
    const result = await this.contentRequestRepository.findAll(query);

    return new PaginatedResponseDto<ContentRequestEntity>(
      result.items.map(toContentRequestEntity),
      result.meta.total,
      result.meta.page,
      result.meta.limit,
    );
  }

  async approveRequest(
    id: string,
    adminId: string,
    dto: ApproveRequestDto,
  ): Promise<{ request: ContentRequestEntity; content: unknown }> {
    const request = await this.contentRequestRepository.findById({ id });
    if (!request) {
      throw new NotFoundException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content request with ID ${id} not found`,
      });
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content request is already ${request.status}`,
      });
    }

    // Use transaction to ensure both content creation and request update succeed
    return this.prismaService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. Create content
        const slug =
          dto.contentData.slug || this.slugify(dto.contentData.title);

        // Check slug uniqueness within transaction
        const existingContent = await tx.content.findUnique({
          where: { slug },
        });
        if (existingContent) {
          throw new BadRequestException({
            code: ErrorCode.VALIDATION_FAILED,
            message: `Content with slug ${slug} already exists`,
          });
        }

        const content = await tx.content.create({
          data: {
            title: dto.contentData.title,
            slug,
            type: dto.contentData.type,
            year: dto.contentData.year,
            synopsis: dto.contentData.synopsis,
            posterUrl: dto.contentData.posterUrl,
            genres: dto.contentData.genres,
            cast: dto.contentData.cast,
            episodes: dto.contentData.episodes,
            durationMinutes: dto.contentData.durationMinutes,
            country: dto.contentData.country || 'South Korea',
            isFeatured: dto.contentData.isFeatured || false,
          },
        });

        // 2. Update request
        const updatedRequest = await tx.contentRequest.update({
          where: { id },
          data: {
            status: RequestStatus.APPROVED,
            contentId: content.id,
            reviewedBy: adminId,
            reviewedAt: new Date(),
          },
        });

        return {
          request: toContentRequestEntity(updatedRequest),
          content,
        };
      },
    );
  }

  async rejectRequest(
    id: string,
    adminId: string,
    dto: RejectRequestDto,
  ): Promise<ContentRequestEntity> {
    const request = await this.contentRequestRepository.findById({ id });
    if (!request) {
      throw new NotFoundException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content request with ID ${id} not found`,
      });
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content request is already ${request.status}`,
      });
    }

    const updatedRequest = await this.contentRequestRepository.update(
      { id },
      {
        status: RequestStatus.REJECTED,
        rejectionReason: dto.reason,
        reviewer: { connect: { id: adminId } },
        reviewedAt: new Date(),
      },
    );

    return toContentRequestEntity(updatedRequest);
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }
}
