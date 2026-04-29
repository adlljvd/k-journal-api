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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
let ContentRequestRepository = class ContentRequestRepository extends base_repository_1.BaseRepository {
    constructor(prismaService, transactionClient) {
        super(prismaService, transactionClient);
    }
    getModel() {
        return this.prismaService.contentRequest;
    }
    async findByUserId(userId, options) {
        const page = Math.max(1, options?.page ?? 1);
        const limit = Math.min(Math.max(1, options?.limit ?? 20), 100);
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(options?.status &&
                options.status !== 'ALL' && { status: options.status }),
        };
        const [items, total] = await Promise.all([
            this.withRetry(() => this.getClient().findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }), 'findByUserId.items'),
            this.withRetry(() => this.getClient().count({ where }), 'findByUserId.count'),
        ]);
        return new paginated_response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async findAll(options) {
        const page = Math.max(1, options?.page ?? 1);
        const limit = Math.min(Math.max(1, options?.limit ?? 20), 100);
        const skip = (page - 1) * limit;
        const where = {
            ...(options?.status &&
                options.status !== 'ALL' && { status: options.status }),
        };
        const [items, total] = await Promise.all([
            this.withRetry(() => this.getClient().findMany({
                where,
                orderBy: { createdAt: 'asc' },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                },
            }), 'findAll.items'),
            this.withRetry(() => this.getClient().count({ where }), 'findAll.count'),
        ]);
        return new paginated_response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async countByUserToday(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.withRetry(() => this.getClient().count({
            where: {
                userId,
                createdAt: {
                    gte: today,
                },
            },
        }), 'countByUserToday');
    }
    async findByUserAndTitle(userId, title) {
        return this.withRetry(() => this.getClient().findFirst({
            where: {
                userId,
                title: {
                    equals: title,
                    mode: 'insensitive',
                },
            },
        }), 'findByUserAndTitle');
    }
    async updateStatus(id, data) {
        return this.update({ id }, data);
    }
    async countPending() {
        return this.withRetry(() => this.getClient().count({
            where: { status: client_1.RequestStatus.PENDING },
        }), 'countPending');
    }
    async findRecent(limit = 5) {
        return this.withRetry(() => this.getClient().findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        }), 'findRecent');
    }
};
exports.ContentRequestRepository = ContentRequestRepository;
exports.ContentRequestRepository = ContentRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(base_repository_1.PRISMA_TRANSACTION)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ContentRequestRepository);
//# sourceMappingURL=content-request.repository.js.map