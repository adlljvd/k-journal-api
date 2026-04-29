/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ContentRequestController } from './content-request.controller';
import { ContentRequestService } from './content-request.service';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { RequestStatus } from '../../common/enums/request-status.enum';
import { ContentType } from '../../common/enums/content-type.enum';
import { Role } from '../../common/enums/role.enum';

describe('ContentRequestController', () => {
  let controller: ContentRequestController;
  let contentRequestService: jest.Mocked<ContentRequestService>;

  const mockRequest = {
    id: 'request-id',
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

  const mockUser = {
    userId: 'user-id',
    email: 'test@test.com',
    username: 'testuser',
    role: Role.USER,
  };

  // Mock request object with minimal required properties

  const mockRequestWithUser: any = {
    user: mockUser,
  };

  beforeEach(async () => {
    const mockContentRequestService = {
      createRequest: jest.fn(),
      getMyRequests: jest.fn(),
      checkDailyLimit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentRequestController],
      providers: [
        {
          provide: ContentRequestService,
          useValue: mockContentRequestService,
        },
      ],
    }).compile();

    controller = module.get<ContentRequestController>(ContentRequestController);
    contentRequestService = module.get(ContentRequestService);
  });

  describe('createRequest', () => {
    const createDto = {
      title: 'Test Drama',
      type: ContentType.DRAMA,
      year: 2023,
      notes: 'Please add this',
    };

    it('should create a content request', async () => {
      contentRequestService.createRequest.mockResolvedValue({
        success: true,
        data: mockRequest,
      } as any);

      const result = await controller.createRequest(
        createDto,
        mockRequestWithUser,
      );

      expect(contentRequestService.createRequest).toHaveBeenCalledWith(
        'user-id',
        createDto,
      );
      expect(result).toEqual(mockRequest);
    });

    it('should throw error when service returns error', async () => {
      contentRequestService.createRequest.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.RATE_LIMIT_EXCEEDED,
          message: 'Daily limit exceeded',
        },
      } as any);

      await expect(
        controller.createRequest(createDto, mockRequestWithUser),
      ).rejects.toThrow();
    });

    it('should pass userId from request to service', async () => {
      contentRequestService.createRequest.mockResolvedValue({
        success: true,
        data: mockRequest,
      } as any);

      await controller.createRequest(createDto, mockRequestWithUser);

      expect(contentRequestService.createRequest).toHaveBeenCalledWith(
        'user-id',
        expect.any(Object),
      );
    });
  });

  describe('getMyRequests', () => {
    const query = {
      page: 1,
      limit: 20,
      status: RequestStatus.PENDING,
    };

    it('should return user requests with pagination', async () => {
      const paginatedResult = {
        items: [mockRequest],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };

      contentRequestService.getMyRequests.mockResolvedValue({
        success: true,
        data: paginatedResult,
      } as any);

      const result = await controller.getMyRequests(query, mockRequestWithUser);

      expect(contentRequestService.getMyRequests).toHaveBeenCalledWith(
        'user-id',
        query,
      );
      expect(result).toEqual(paginatedResult);
    });

    it('should pass query parameters to service', async () => {
      contentRequestService.getMyRequests.mockResolvedValue({
        success: true,
        data: {
          items: [],
          meta: { total: 0, page: 2, limit: 10, totalPages: 0 },
        },
      } as any);

      await controller.getMyRequests(
        { page: 2, limit: 10 },
        mockRequestWithUser,
      );

      expect(contentRequestService.getMyRequests).toHaveBeenCalledWith(
        'user-id',
        { page: 2, limit: 10 },
      );
    });

    it('should throw error when service returns error', async () => {
      contentRequestService.getMyRequests.mockResolvedValue({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          message: 'Invalid query',
        },
      } as any);

      await expect(
        controller.getMyRequests({ page: 1, limit: 20 }, mockRequestWithUser),
      ).rejects.toThrow();
    });
  });
});
