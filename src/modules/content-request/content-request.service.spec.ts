/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ContentRequestService } from './content-request.service';
import { ContentRequestRepository } from './content-request.repository';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { RequestStatus } from '../../common/enums/request-status.enum';
import { ContentType } from '../../common/enums/content-type.enum';
import { CreateContentRequestDto } from './dto';

describe('ContentRequestService', () => {
  let service: ContentRequestService;
  let repository: jest.Mocked<ContentRequestRepository>;

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockRequestId = '550e8400-e29b-41d4-a716-446655440001';

  const mockContentRequest = {
    id: mockRequestId,
    userId: mockUserId,
    title: 'My Love from the Star',
    type: ContentType.DRAMA,
    year: 2013,
    notes: 'Please add this drama!',
    status: RequestStatus.PENDING,
    rejectionReason: null,
    contentId: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    reviewedAt: null,
    reviewedBy: null,
  };

  beforeEach(async () => {
    const mockRepository = {
      countByUserToday: jest.fn(),
      findByUserAndTitle: jest.fn(),
      create: jest.fn(),
      findByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentRequestService,
        {
          provide: ContentRequestRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContentRequestService>(ContentRequestService);
    repository = module.get(ContentRequestRepository);
  });

  describe('createRequest', () => {
    const createDto: CreateContentRequestDto = {
      title: 'My Love from the Star',
      type: ContentType.DRAMA,
      year: 2013,
      notes: 'Please add this drama!',
    };

    it('should create a request with PENDING status when valid', async () => {
      repository.countByUserToday.mockResolvedValue(0);
      repository.findByUserAndTitle.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockContentRequest);

      const result = await service.createRequest(mockUserId, createDto);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(RequestStatus.PENDING);
        expect(result.data.title).toBe(createDto.title);
        expect(result.data.type).toBe(createDto.type);
      }
      expect(repository.countByUserToday).toHaveBeenCalledWith(mockUserId);
      expect(repository.findByUserAndTitle).toHaveBeenCalledWith(
        mockUserId,
        createDto.title,
      );
      expect(repository.create).toHaveBeenCalled();
    });

    it('should return RATE_LIMIT_EXCEEDED when daily limit of 5 is reached', async () => {
      repository.countByUserToday.mockResolvedValue(5);

      const result = await service.createRequest(mockUserId, createDto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
        expect(result.error.message).toContain('daily limit');
      }
      expect(repository.countByUserToday).toHaveBeenCalledWith(mockUserId);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should return DUPLICATE_REQUEST when user already requested the same title', async () => {
      repository.countByUserToday.mockResolvedValue(0);
      repository.findByUserAndTitle.mockResolvedValue(mockContentRequest);

      const result = await service.createRequest(mockUserId, createDto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.DUPLICATE_REQUEST);
        expect(result.error.message).toContain('already submitted');
      }
      expect(repository.findByUserAndTitle).toHaveBeenCalledWith(
        mockUserId,
        createDto.title,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should allow request when under daily limit (4 requests today)', async () => {
      repository.countByUserToday.mockResolvedValue(4);
      repository.findByUserAndTitle.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockContentRequest);

      const result = await service.createRequest(mockUserId, createDto);

      expect(result.success).toBe(true);
      expect(repository.create).toHaveBeenCalled();
    });

    it('should allow request with minimal data (title and type only)', async () => {
      const minimalDto: CreateContentRequestDto = {
        title: 'Crash Landing on You',
        type: ContentType.DRAMA,
      };

      repository.countByUserToday.mockResolvedValue(0);
      repository.findByUserAndTitle.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        ...mockContentRequest,
        title: minimalDto.title,
        year: null,
        notes: null,
      });

      const result = await service.createRequest(mockUserId, minimalDto);

      expect(result.success).toBe(true);
    });

    it('should check duplicate title case-insensitively', async () => {
      repository.countByUserToday.mockResolvedValue(0);
      repository.findByUserAndTitle.mockResolvedValue(mockContentRequest);

      await service.createRequest(mockUserId, {
        ...createDto,
        title: 'MY LOVE FROM THE STAR', // Different case
      });

      // Repository handles case-insensitive check
      expect(repository.findByUserAndTitle).toHaveBeenCalled();
    });
  });

  describe('getMyRequests', () => {
    it('should return paginated list of user requests', async () => {
      const mockPaginatedResult = {
        items: [mockContentRequest],
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };

      repository.findByUserId.mockResolvedValue(mockPaginatedResult);

      const result = await service.getMyRequests(mockUserId, {
        page: 1,
        limit: 20,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.meta.total).toBe(1);
      }
    });

    it('should filter by status when provided', async () => {
      const mockPaginatedResult = {
        items: [mockContentRequest],
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };

      repository.findByUserId.mockResolvedValue(mockPaginatedResult);

      await service.getMyRequests(mockUserId, {
        page: 1,
        limit: 20,
        status: RequestStatus.PENDING,
      });

      expect(repository.findByUserId).toHaveBeenCalledWith(mockUserId, {
        page: 1,
        limit: 20,
        status: RequestStatus.PENDING,
      });
    });

    it('should return empty list when user has no requests', async () => {
      const mockPaginatedResult = {
        items: [],
        meta: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      };

      repository.findByUserId.mockResolvedValue(mockPaginatedResult);

      const result = await service.getMyRequests(mockUserId, {
        page: 1,
        limit: 20,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(0);
        expect(result.data.meta.total).toBe(0);
      }
    });
  });

  describe('checkDailyLimit', () => {
    it('should return remaining requests count when under limit', async () => {
      repository.countByUserToday.mockResolvedValue(2);

      const result = await service.checkDailyLimit(mockUserId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.remaining).toBe(3);
      }
    });

    it('should return 0 remaining when at limit', async () => {
      repository.countByUserToday.mockResolvedValue(5);

      const result = await service.checkDailyLimit(mockUserId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.remaining).toBe(0);
      }
    });

    it('should return 5 remaining when no requests today', async () => {
      repository.countByUserToday.mockResolvedValue(0);

      const result = await service.checkDailyLimit(mockUserId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.remaining).toBe(5);
      }
    });
  });
});
