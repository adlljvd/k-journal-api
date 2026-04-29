import { ContentRepository } from '../content/content.repository';
import { ContentRequestRepository } from '../content-request/content-request.repository';
import { AdminDashboardEntity } from './entities/admin-dashboard.entity';
export declare class AdminService {
    private readonly contentRepository;
    private readonly contentRequestRepository;
    constructor(contentRepository: ContentRepository, contentRequestRepository: ContentRequestRepository);
    getDashboard(): Promise<AdminDashboardEntity>;
}
