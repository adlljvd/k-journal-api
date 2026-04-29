/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { ContentRequestRepository } from './content-request.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestStatus } from '../../common/enums/request-status.enum';
import { ContentType } from '../../common/enums/content-type.enum';

describe('ContentRequestRepository', () => {
  let repository: ContentRequestRepository;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFindMany: jest.Mock<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCount: jest.Mock<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFindFirst: jest.Mock<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCreate: jest.Mock<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUpdate: jest.Mock<any, any>;

  const mockContentRequest = {
    id: 'request-id',
    userId: 'user-id',
    title: 'Test Drama',
    type: ContentType.DRAMA,
    year: 2023,
    notes: 'Please add this',
    status: RequestStatus.PENDING,
    rejectionReason: null,
    contentId: null,
    createdAt: new Date(),
    reviewedAt: null,
    reviewedBy: null,
  };

  beforeEach(async () => {
    mockFindMany = jest.fn();
    mockCount = jest.fn();
    mockFindFirst = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockPrismaService: any = {
      contentRequest: {
        findMany: mockFindMany,
        count: mockCount,
        findFirst: mockFindFirst,
        create: mockCreate,
        update: mockUpdate,
        delete: jest.fn(),
      },
      $transaction: jest.fn(
        (fn: (client: typeof mockPrismaService) => Promise<unknown>) =>
          fn(mockPrismaService),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentRequestRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ContentRequestRepository>(ContentRequestRepository);
  });

  describe('findByUserId', () => {
    it('should return paginated requests for a user', async () => {
      mockFindMany.mockResolvedValue([mockContentRequest]);
      mockCount.mockResolvedValue(1);

      const result = await repository.findByUserId('user-id', {
        page: 1,
        limit: 20,
      });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
    });

    it('should filter by status when provided', async () => {
      mockFindMany.mockResolvedValue([mockContentRequest]);
      mockCount.mockResolvedValue(1);

      await repository.findByUserId('user-id', {
        page: 1,
        limit: 20,
        status: RequestStatus.PENDING,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-id',
            status: RequestStatus.PENDING,
          }),
        }),
      );
    });

    it('should return all statuses when status is ALL', async () => {
      mockFindMany.mockResolvedValue([mockContentRequest]);
      mockCount.mockResolvedValue(1);

      await repository.findByUserId('user-id', {
        page: 1,
        limit: 20,
        status: 'ALL' as RequestStatus,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-id',
          }),
        }),
      );
    });

    it('should handle empty results', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      const result = await repository.findByUserId('user-id', {
        page: 1,
        limit: 20,
      });

      expect(result.items).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should enforce pagination limits (max 100)', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await repository.findByUserId('user-id', {
        page: 1,
        limit: 200,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        }),
      );
    });

    it('should default to page 1 when page is less than 1', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await repository.findByUserId('user-id', {
        page: 0,
        limit: 20,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
        }),
      );
    });
  });

  describe('countByUserToday', () => {
    it('should count requests created today', async () => {
      mockCount.mockResolvedValue(3);

      const count = await repository.countByUserToday('user-id');

      expect(count).toBe(3);
      expect(mockCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-id',
            createdAt: expect.objectContaining({
              gte: expect.any(Date),
            }),
          }),
        }),
      );
    });

    it('should return 0 when no requests today', async () => {
      mockCount.mockResolvedValue(0);

      const count = await repository.countByUserToday('user-id');

      expect(count).toBe(0);
    });
  });

  describe('findByUserAndTitle', () => {
    it('should find existing request by user and title', async () => {
      mockFindFirst.mockResolvedValue(mockContentRequest);

      const result = await repository.findByUserAndTitle(
        'user-id',
        'Test Drama',
      );

      expect(result).toEqual(mockContentRequest);
      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-id',
            title: expect.objectContaining({
              equals: 'Test Drama',
              mode: 'insensitive',
            }),
          }),
        }),
      );
    });

    it('should return null when no matching request', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByUserAndTitle(
        'user-id',
        'Nonexistent',
      );

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update request status', async () => {
      const updatedRequest = {
        ...mockContentRequest,
        status: RequestStatus.APPROVED,
      };
      mockUpdate.mockResolvedValue(updatedRequest);

      const result = await repository.updateStatus('request-id', {
        status: RequestStatus.APPROVED,
      });

      expect(result.status).toBe(RequestStatus.APPROVED);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'request-id' },
          data: { status: RequestStatus.APPROVED },
        }),
      );
    });

    it('should update with rejection reason', async () => {
      const rejectedRequest = {
        ...mockContentRequest,
        status: RequestStatus.REJECTED,
        rejectionReason: 'Not enough information',
      };
      mockUpdate.mockResolvedValue(rejectedRequest);

      const result = await repository.updateStatus('request-id', {
        status: RequestStatus.REJECTED,
        rejectionReason: 'Not enough information',
      });

      expect(result.status).toBe(RequestStatus.REJECTED);
      expect(result.rejectionReason).toBe('Not enough information');
    });

    it('should link content when approved', async () => {
      const approvedRequest = {
        ...mockContentRequest,
        status: RequestStatus.APPROVED,
        contentId: 'content-id',
      };
      mockUpdate.mockResolvedValue(approvedRequest);

      const result = await repository.updateStatus('request-id', {
        status: RequestStatus.APPROVED,
        contentId: 'content-id',
      });

      expect(result.contentId).toBe('content-id');
    });
  });

  describe('countPending', () => {
    it('should count pending requests', async () => {
      mockCount.mockResolvedValue(5);

      const count = await repository.countPending();

      expect(count).toBe(5);
      expect(mockCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: RequestStatus.PENDING },
        }),
      );
    });
  });

  describe('findRecent', () => {
    it('should return recent requests with limit', async () => {
      const recentRequests = [mockContentRequest, mockContentRequest];
      mockFindMany.mockResolvedValue(recentRequests);

      const result = await repository.findRecent(5);

      expect(result).toHaveLength(2);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      );
    });

    it('should use default limit of 5', async () => {
      mockFindMany.mockResolvedValue([]);

      await repository.findRecent();

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });
  });

  describe('findAll (admin view)', () => {
    it('should return paginated requests for admin', async () => {
      const mockRequestWithUser = {
        ...mockContentRequest,
        user: { id: 'user-id', username: 'testuser', email: 'test@test.com' },
      };
      mockFindMany.mockResolvedValue([mockRequestWithUser]);
      mockCount.mockResolvedValue(1);

      const result = await repository.findAll({
        page: 1,
        limit: 20,
      });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await repository.findAll({
        page: 1,
        limit: 20,
        status: RequestStatus.PENDING,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: RequestStatus.PENDING,
          }),
        }),
      );
    });

    it('should order by createdAt ascending for admin review', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await repository.findAll({ page: 1, limit: 20 });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'asc' },
        }),
      );
    });
  });
});
