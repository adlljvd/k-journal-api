import { Injectable } from '@nestjs/common';
import { ContentRepository } from '../content/content.repository';
import { ContentRequestRepository } from '../content-request/content-request.repository';
import { AdminDashboardEntity } from './entities/admin-dashboard.entity';
import { ContentRequestEntity } from '../content-request/entities/content-request.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly contentRequestRepository: ContentRequestRepository,
  ) {}

  async getDashboard(): Promise<AdminDashboardEntity> {
    const [pendingRequestsCount, totalContentCount, recentRequests] =
      await Promise.all([
        this.contentRequestRepository.countPending(),
        this.contentRepository.count({}),
        this.contentRequestRepository.findRecent(5),
      ]);

    return new AdminDashboardEntity({
      pendingRequestsCount,
      totalContentCount,
      recentRequests: recentRequests.map(
        (req) =>
          new ContentRequestEntity({
            ...req,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            type: req.type as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            status: req.status as any,
          }),
      ),
    });
  }
}
