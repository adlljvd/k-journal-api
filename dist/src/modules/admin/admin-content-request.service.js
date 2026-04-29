"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminContentRequestService = void 0;
const common_1 = require("@nestjs/common");
const content_request_repository_1 = require("../content-request/content-request.repository");
const content_repository_1 = require("../content/content.repository");
const admin_content_service_1 = require("./admin-content.service");
const entities_1 = require("../content-request/entities");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminContentRequestService = class AdminContentRequestService {
    contentRequestRepository;
    contentRepository;
    adminContentService;
    prismaService;
    constructor(contentRequestRepository, contentRepository, adminContentService, prismaService) {
        this.contentRequestRepository = contentRequestRepository;
        this.contentRepository = contentRepository;
        this.adminContentService = adminContentService;
        this.prismaService = prismaService;
    }
    async getAllRequests(query) {
        const result = await this.contentRequestRepository.findAll(query);
        return new paginated_response_dto_1.PaginatedResponseDto(result.items.map(entities_1.toContentRequestEntity), result.meta.total, result.meta.page, result.meta.limit);
    }
    async approveRequest(id, adminId, dto) {
        const request = await this.contentRequestRepository.findById({ id });
        if (!request) {
            throw new common_1.NotFoundException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content request with ID ${id} not found`,
            });
        }
        if (request.status !== client_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content request is already ${request.status}`,
            });
        }
        return this.prismaService.$transaction(async (tx) => {
            const slug = dto.contentData.slug || this.slugify(dto.contentData.title);
            const existingContent = await tx.content.findUnique({
                where: { slug },
            });
            if (existingContent) {
                throw new common_1.BadRequestException({
                    code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                    message: `Content with slug ${slug} already exists`,
                });
            }
            const content = await tx.content.create({
                data: {
                    title: dto.contentData.title,
                    slug,
                    type: dto.contentData.type,
                    year: dto.contentData.year,
                    synopsis: dto.contentData.synopsis,
                    posterUrl: dto.contentData.posterUrl,
                    genres: dto.contentData.genres,
                    cast: dto.contentData.cast,
                    episodes: dto.contentData.episodes,
                    durationMinutes: dto.contentData.durationMinutes,
                    country: dto.contentData.country || 'South Korea',
                    isFeatured: dto.contentData.isFeatured || false,
                },
            });
            const updatedRequest = await tx.contentRequest.update({
                where: { id },
                data: {
                    status: client_1.RequestStatus.APPROVED,
                    contentId: content.id,
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                },
            });
            return {
                request: (0, entities_1.toContentRequestEntity)(updatedRequest),
                content,
            };
        });
    }
    async rejectRequest(id, adminId, dto) {
        const request = await this.contentRequestRepository.findById({ id });
        if (!request) {
            throw new common_1.NotFoundException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content request with ID ${id} not found`,
            });
        }
        if (request.status !== client_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content request is already ${request.status}`,
            });
        }
        const updatedRequest = await this.contentRequestRepository.update({ id }, {
            status: client_1.RequestStatus.REJECTED,
            rejectionReason: dto.reason,
            reviewer: { connect: { id: adminId } },
            reviewedAt: new Date(),
        });
        return (0, entities_1.toContentRequestEntity)(updatedRequest);
    }
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    }
};
exports.AdminContentRequestService = AdminContentRequestService;
exports.AdminContentRequestService = AdminContentRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_request_repository_1.ContentRequestRepository,
        content_repository_1.ContentRepository,
        admin_content_service_1.AdminContentService,
        prisma_service_1.PrismaService])
], AdminContentRequestService);
//# sourceMappingURL=admin-content-request.service.js.map