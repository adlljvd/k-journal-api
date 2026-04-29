import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { ContentRepository } from '../content/content.repository';
import { ContentRequestRepository } from '../content-request/content-request.repository';
import { ContentType, RequestStatus, ContentRequest } from '@prisma/client';

describe('AdminService', () => {
  let service: AdminService;
  let contentRepository: jest.Mocked<ContentRepository>;
  let contentRequestRepository: jest.Mocked<ContentRequestRepository>;

  beforeEach(async () => {
    const mockContentRepository = {
      count: jest.fn(),
    };

    const mockContentRequestRepository = {
      countPending: jest.fn(),
      findRecent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: ContentRepository, useValue: mockContentRepository },
        {
          provide: ContentRequestRepository,
          useValue: mockContentRequestRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    contentRepository = module.get(ContentRepository);
    contentRequestRepository = module.get(ContentRequestRepository);
  });

  describe('getDashboard', () => {
    it('should return dashboard summary data with one recent request', async () => {
      // Arrange
      const pendingCount = 5;
      const totalContent = 100;
      const recentRequests: Partial<ContentRequest>[] = [
        {
          id: 'req-1',
          title: 'Test Drama',
          type: ContentType.DRAMA,
          status: RequestStatus.PENDING,
          createdAt: new Date(),
        },
      ];

      contentRequestRepository.countPending.mockResolvedValue(pendingCount);
      contentRepository.count.mockResolvedValue(totalContent);
      contentRequestRepository.findRecent.mockResolvedValue(
        recentRequests as ContentRequest[],
      );

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.pendingRequestsCount).toBe(pendingCount);
      expect(result.totalContentCount).toBe(totalContent);
      expect(result.recentRequests).toHaveLength(1);
      expect(result.recentRequests[0].title).toBe('Test Drama');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRequestRepository.findRecent).toHaveBeenCalledWith(5);
    });

    it('should return dashboard with empty recent requests', async () => {
      // Arrange
      const pendingCount = 0;
      const totalContent = 0;
      const recentRequests: ContentRequest[] = [];

      contentRequestRepository.countPending.mockResolvedValue(pendingCount);
      contentRepository.count.mockResolvedValue(totalContent);
      contentRequestRepository.findRecent.mockResolvedValue(recentRequests);

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.pendingRequestsCount).toBe(0);
      expect(result.totalContentCount).toBe(0);
      expect(result.recentRequests).toHaveLength(0);
      expect(result.recentRequests).toEqual([]);
    });

    it('should return dashboard with multiple recent requests', async () => {
      // Arrange
      const pendingCount = 10;
      const totalContent = 250;
      const recentRequests: Partial<ContentRequest>[] = [
        {
          id: 'req-1',
          title: 'Drama One',
          type: ContentType.DRAMA,
          status: RequestStatus.PENDING,
          createdAt: new Date('2024-01-03'),
        },
        {
          id: 'req-2',
          title: 'Movie Two',
          type: ContentType.MOVIE,
          status: RequestStatus.APPROVED,
          createdAt: new Date('2024-01-02'),
        },
        {
          id: 'req-3',
          title: 'Drama Three',
          type: ContentType.DRAMA,
          status: RequestStatus.REJECTED,
          createdAt: new Date('2024-01-01'),
        },
      ];

      contentRequestRepository.countPending.mockResolvedValue(pendingCount);
      contentRepository.count.mockResolvedValue(totalContent);
      contentRequestRepository.findRecent.mockResolvedValue(
        recentRequests as ContentRequest[],
      );

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.pendingRequestsCount).toBe(10);
      expect(result.totalContentCount).toBe(250);
      expect(result.recentRequests).toHaveLength(3);
      expect(result.recentRequests[0].title).toBe('Drama One');
      expect(result.recentRequests[0].type).toBe(ContentType.DRAMA);
      expect(result.recentRequests[1].title).toBe('Movie Two');
      expect(result.recentRequests[1].type).toBe(ContentType.MOVIE);
      expect(result.recentRequests[2].status).toBe(RequestStatus.REJECTED);
    });

    it('should map content request with all fields populated', async () => {
      // Arrange
      const pendingCount = 1;
      const totalContent = 50;
      const recentRequests: Partial<ContentRequest>[] = [
        {
          id: 'req-full',
          userId: 'user-123',
          title: 'Full Request',
          type: ContentType.DRAMA,
          year: 2023,
          notes: 'Please add this drama',
          status: RequestStatus.PENDING,
          rejectionReason: null,
          contentId: null,
          createdAt: new Date('2024-01-01'),
          reviewedAt: null,
          reviewedBy: null,
        },
      ];

      contentRequestRepository.countPending.mockResolvedValue(pendingCount);
      contentRepository.count.mockResolvedValue(totalContent);
      contentRequestRepository.findRecent.mockResolvedValue(
        recentRequests as ContentRequest[],
      );

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.recentRequests).toHaveLength(1);
      const request = result.recentRequests[0];
      expect(request.id).toBe('req-full');
      expect(request.userId).toBe('user-123');
      expect(request.title).toBe('Full Request');
      expect(request.type).toBe(ContentType.DRAMA);
      expect(request.status).toBe(RequestStatus.PENDING);
    });

    it('should handle request with APPROVED status', async () => {
      // Arrange
      const recentRequests: Partial<ContentRequest>[] = [
        {
          id: 'req-approved',
          title: 'Approved Content',
          type: ContentType.MOVIE,
          status: RequestStatus.APPROVED,
          contentId: 'content-123',
          createdAt: new Date(),
        },
      ];

      contentRequestRepository.countPending.mockResolvedValue(0);
      contentRepository.count.mockResolvedValue(1);
      contentRequestRepository.findRecent.mockResolvedValue(
        recentRequests as ContentRequest[],
      );

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.recentRequests[0].status).toBe(RequestStatus.APPROVED);
      expect(result.recentRequests[0].contentId).toBe('content-123');
    });

    it('should handle request with REJECTED status and rejection reason', async () => {
      // Arrange
      const recentRequests: Partial<ContentRequest>[] = [
        {
          id: 'req-rejected',
          title: 'Rejected Content',
          type: ContentType.DRAMA,
          status: RequestStatus.REJECTED,
          rejectionReason: 'Content already exists',
          createdAt: new Date(),
        },
      ];

      contentRequestRepository.countPending.mockResolvedValue(0);
      contentRepository.count.mockResolvedValue(1);
      contentRequestRepository.findRecent.mockResolvedValue(
        recentRequests as ContentRequest[],
      );

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.recentRequests[0].status).toBe(RequestStatus.REJECTED);
      expect(result.recentRequests[0].rejectionReason).toBe(
        'Content already exists',
      );
    });

    it('should call all repository methods in parallel', async () => {
      // Arrange
      const countPendingSpy = jest.fn().mockResolvedValue(5);
      const countSpy = jest.fn().mockResolvedValue(100);
      const findRecentSpy = jest.fn().mockResolvedValue([]);

      contentRequestRepository.countPending = countPendingSpy;
      contentRepository.count = countSpy;
      contentRequestRepository.findRecent = findRecentSpy;

      // Act
      await service.getDashboard();

      // Assert
      expect(countPendingSpy).toHaveBeenCalledTimes(1);
      expect(countSpy).toHaveBeenCalledTimes(1);
      expect(countSpy).toHaveBeenCalledWith({});
      expect(findRecentSpy).toHaveBeenCalledTimes(1);
      expect(findRecentSpy).toHaveBeenCalledWith(5);
    });

    it('should handle large numbers for counts', async () => {
      // Arrange
      const pendingCount = 999999;
      const totalContent = 1000000;
      const recentRequests: ContentRequest[] = [];

      contentRequestRepository.countPending.mockResolvedValue(pendingCount);
      contentRepository.count.mockResolvedValue(totalContent);
      contentRequestRepository.findRecent.mockResolvedValue(recentRequests);

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.pendingRequestsCount).toBe(999999);
      expect(result.totalContentCount).toBe(1000000);
    });

    it('should return max 5 recent requests as configured', async () => {
      // Arrange - simulate 7 requests but only 5 should be returned
      const recentRequests: Partial<ContentRequest>[] = Array.from(
        { length: 5 },
        (_, i) => ({
          id: `req-${i + 1}`,
          title: `Request ${i + 1}`,
          type: ContentType.DRAMA,
          status: RequestStatus.PENDING,
          createdAt: new Date(),
        }),
      );

      contentRequestRepository.countPending.mockResolvedValue(7);
      contentRepository.count.mockResolvedValue(100);
      contentRequestRepository.findRecent.mockResolvedValue(
        recentRequests as ContentRequest[],
      );

      // Act
      const result = await service.getDashboard();

      // Assert
      expect(result.recentRequests).toHaveLength(5);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRequestRepository.findRecent).toHaveBeenCalledWith(5);
    });
  });
});
