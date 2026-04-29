import { AdminService } from './admin.service';
import { AdminContentService } from './admin-content.service';
import { AdminContentRequestService } from './admin-content-request.service';
import { ApproveRequestDto, RejectRequestDto, CreateContentDto, UpdateContentDto, QueryAdminContentDto } from './dto';
import { AdminDashboardEntity } from './entities/admin-dashboard.entity';
import { ContentRequestEntity } from '../content-request/entities/content-request.entity';
import { ContentEntity } from '../content/entities/content.entity';
import { RequestStatus } from '@prisma/client';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class AdminController {
    private readonly adminService;
    private readonly adminContentService;
    private readonly adminContentRequestService;
    constructor(adminService: AdminService, adminContentService: AdminContentService, adminContentRequestService: AdminContentRequestService);
    getDashboard(): Promise<AdminDashboardEntity>;
    getAllRequests(page?: number, limit?: number, status?: RequestStatus | 'ALL'): Promise<PaginatedResponseDto<ContentRequestEntity>>;
    approveRequest(id: string, req: RequestWithUser, dto: ApproveRequestDto): Promise<{
        request: ContentRequestEntity;
        content: unknown;
    }>;
    rejectRequest(id: string, req: RequestWithUser, dto: RejectRequestDto): Promise<ContentRequestEntity>;
    createContent(dto: CreateContentDto): Promise<ContentEntity>;
    updateContent(id: string, dto: UpdateContentDto): Promise<ContentEntity>;
    deleteContent(id: string): Promise<void>;
    listContent(query: QueryAdminContentDto): Promise<PaginatedResponseDto<ContentEntity>>;
}
