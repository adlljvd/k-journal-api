import { ContentRequestEntity } from '../../content-request/entities/content-request.entity';
export declare class AdminDashboardEntity {
    pendingRequestsCount: number;
    totalContentCount: number;
    recentRequests: ContentRequestEntity[];
    constructor(partial: Partial<AdminDashboardEntity>);
}
