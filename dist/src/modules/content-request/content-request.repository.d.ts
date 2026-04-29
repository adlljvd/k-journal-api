import { Prisma, ContentRequest, RequestStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class ContentRequestRepository extends BaseRepository<ContentRequest, Prisma.ContentRequestCreateInput, Prisma.ContentRequestUpdateInput, Prisma.ContentRequestWhereUniqueInput, Prisma.ContentRequestWhereInput, Prisma.ContentRequestDelegate> {
    constructor(prismaService: PrismaService, transactionClient?: unknown);
    protected getModel(): Prisma.ContentRequestDelegate;
    findByUserId(userId: string, options?: {
        page?: number;
        limit?: number;
        status?: RequestStatus | 'ALL';
    }): Promise<PaginatedResponseDto<ContentRequest>>;
    findAll(options?: {
        page?: number;
        limit?: number;
        status?: RequestStatus | 'ALL';
    }): Promise<PaginatedResponseDto<ContentRequest>>;
    countByUserToday(userId: string): Promise<number>;
    findByUserAndTitle(userId: string, title: string): Promise<ContentRequest | null>;
    updateStatus(id: string, data: {
        status: RequestStatus;
        rejectionReason?: string;
        contentId?: string;
        reviewedBy?: string;
        reviewedAt?: Date;
    }): Promise<ContentRequest>;
    countPending(): Promise<number>;
    findRecent(limit?: number): Promise<ContentRequest[]>;
}
