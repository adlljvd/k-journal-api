import { ContentRequestRepository } from '../content-request/content-request.repository';
import { ContentRepository } from '../content/content.repository';
import { AdminContentService } from './admin-content.service';
import { ApproveRequestDto, RejectRequestDto } from './dto';
import { ContentRequestEntity } from '../content-request/entities';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminContentRequestService {
    private readonly contentRequestRepository;
    private readonly contentRepository;
    private readonly adminContentService;
    private readonly prismaService;
    constructor(contentRequestRepository: ContentRequestRepository, contentRepository: ContentRepository, adminContentService: AdminContentService, prismaService: PrismaService);
    getAllRequests(query: {
        page?: number;
        limit?: number;
        status?: RequestStatus | 'ALL';
    }): Promise<PaginatedResponseDto<ContentRequestEntity>>;
    approveRequest(id: string, adminId: string, dto: ApproveRequestDto): Promise<{
        request: ContentRequestEntity;
        content: unknown;
    }>;
    rejectRequest(id: string, adminId: string, dto: RejectRequestDto): Promise<ContentRequestEntity>;
    private slugify;
}
