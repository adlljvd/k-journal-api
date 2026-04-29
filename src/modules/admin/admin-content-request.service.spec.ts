/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminContentRequestService } from './admin-content-request.service';
import { ContentRequestRepository } from '../content-request/content-request.repository';
import { ContentRepository } from '../content/content.repository';
import { AdminContentService } from './admin-content.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestStatus, ContentType, ContentRequest } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ApproveRequestDto } from './dto';

describe('AdminContentRequestService', () => {
  let service: AdminContentRequestService;
  let contentRequestRepository: jest.Mocked<ContentRequestRepository>;
  let prismaService: any;

  beforeEach(async () => {
    const mockContentRequestRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

    const mockContentRepository = {};
    const mockAdminContentService = {};

    const mockPrismaService = {
      $transaction: jest.fn(),
      content: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      contentRequest: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminContentRequestService,
        {
          provide: ContentRequestRepository,
          useValue: mockContentRequestRepository,
        },
        { provide: ContentRepository, useValue: mockContentRepository },
        { provide: AdminContentService, useValue: mockAdminContentService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminContentRequestService>(
      AdminContentRequestService,
    );
    contentRequestRepository = module.get(ContentRequestRepository);
    prismaService = module.get(PrismaService);
  });

  describe('getAllRequests', () => {
    it('should return paginated requests', async () => {
      const mockResult = {
        items: [
          {
            id: '1',
            title: 'Test',
            type: ContentType.DRAMA,
            status: RequestStatus.PENDING,
            createdAt: new Date(),
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      };

      contentRequestRepository.findAll.mockResolvedValue(mockResult as any);

      const result = await service.getAllRequests({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRequestRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('approveRequest', () => {
    const id = 'req-id';
    const adminId = 'admin-id';
    const dto: ApproveRequestDto = {
      contentData: {
        title: 'New Content',
        type: ContentType.DRAMA,
        year: 2024,
        genres: [],
        isFeatured: false,
        country: 'South Korea',
      },
    };

    it('should approve request and create content in a transaction', async () => {
      const mockRequest = { id, status: RequestStatus.PENDING };
      contentRequestRepository.findById.mockResolvedValue(
        mockRequest as ContentRequest,
      );

      prismaService.$transaction.mockImplementation(async (cb: any) =>
        cb(prismaService),
      );
      prismaService.content.findUnique.mockResolvedValue(null);
      prismaService.content.create.mockResolvedValue({
        id: 'content-id',
        ...dto.contentData,
      });
      prismaService.contentRequest.update.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.APPROVED,
        contentId: 'content-id',
      });

      const result = await service.approveRequest(id, adminId, dto);

      expect(result.request.status).toBe(RequestStatus.APPROVED);
      expect(result.content).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if request not found', async () => {
      contentRequestRepository.findById.mockResolvedValue(null);

      await expect(service.approveRequest(id, adminId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if request is not PENDING', async () => {
      contentRequestRepository.findById.mockResolvedValue({
        id,
        status: RequestStatus.APPROVED,
      } as ContentRequest);

      await expect(service.approveRequest(id, adminId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if slug already exists', async () => {
      contentRequestRepository.findById.mockResolvedValue({
        id,
        status: RequestStatus.PENDING,
      } as ContentRequest);
      prismaService.$transaction.mockImplementation(async (cb: any) =>
        cb(prismaService),
      );
      prismaService.content.findUnique.mockResolvedValue({
        id: 'existing',
      });

      await expect(service.approveRequest(id, adminId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('rejectRequest', () => {
    const id = 'req-id';
    const adminId = 'admin-id';
    const dto = { reason: 'Not suitable' };

    it('should reject request', async () => {
      const mockRequest = { id, status: RequestStatus.PENDING };
      contentRequestRepository.findById.mockResolvedValue(
        mockRequest as ContentRequest,
      );
      contentRequestRepository.update.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.REJECTED,
        rejectionReason: dto.reason,
      } as ContentRequest);

      const result = await service.rejectRequest(id, adminId, dto);

      expect(result.status).toBe(RequestStatus.REJECTED);
      expect(result.rejectionReason).toBe(dto.reason);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRequestRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if request not found', async () => {
      contentRequestRepository.findById.mockResolvedValue(null);

      await expect(service.rejectRequest(id, adminId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if request is not PENDING', async () => {
      contentRequestRepository.findById.mockResolvedValue({
        id,
        status: RequestStatus.REJECTED,
      } as ContentRequest);

      await expect(service.rejectRequest(id, adminId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
