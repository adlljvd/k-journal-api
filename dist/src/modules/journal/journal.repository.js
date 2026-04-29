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
exports.JournalRepository = exports.JOURNAL_ENTRY_INCLUDE = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
exports.JOURNAL_ENTRY_INCLUDE = {
    content: true,
};
let JournalRepository = class JournalRepository extends base_repository_1.BaseRepository {
    constructor(prismaService, transactionClient) {
        super(prismaService, transactionClient);
    }
    getModel() {
        return this.prismaService.journalEntry;
    }
    async findByUserAndContent(userId, contentId) {
        return this.withRetry(() => this.getClient().findUnique({
            where: {
                userId_contentId: {
                    userId,
                    contentId,
                },
            },
            include: exports.JOURNAL_ENTRY_INCLUDE,
        }), 'findByUserAndContent');
    }
    async findPaginatedByUser(options) {
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(Math.max(1, options.limit ?? 20), 100);
        const skip = (page - 1) * limit;
        const { userId, status, sort = 'updatedAt', order = 'desc' } = options;
        const where = {
            userId,
            ...(status && status !== 'ALL' && { status }),
        };
        let orderBy = {};
        if (sort === 'title') {
            orderBy = { content: { title: order } };
        }
        else {
            orderBy = { [sort]: order };
        }
        const [items, total] = await Promise.all([
            this.withRetry(() => this.getClient().findMany({
                where,
                include: exports.JOURNAL_ENTRY_INCLUDE,
                orderBy,
                skip,
                take: limit,
            }), 'findPaginatedByUser.items'),
            this.withRetry(() => this.getClient().count({ where }), 'findPaginatedByUser.count'),
        ]);
        return new paginated_response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async findByFavorites(userId) {
        return this.withRetry(() => this.getClient().findMany({
            where: {
                userId,
                isFavorite: true,
            },
            include: exports.JOURNAL_ENTRY_INCLUDE,
            orderBy: { updatedAt: 'desc' },
        }), 'findByFavorites');
    }
    async findByIdWithOwner(id, userId) {
        return this.withRetry(() => this.getClient().findUnique({
            where: { id, userId },
            include: exports.JOURNAL_ENTRY_INCLUDE,
        }), 'findByIdWithOwner');
    }
    async countTotalByUser(userId) {
        return this.withRetry(() => this.getClient().count({ where: { userId } }), 'countTotalByUser');
    }
    async countRatedByUser(userId) {
        return this.withRetry(() => this.getClient().count({
            where: {
                userId,
                rating: { not: null },
            },
        }), 'countRatedByUser');
    }
    async countFavoritesByUser(userId) {
        return this.withRetry(() => this.getClient().count({
            where: {
                userId,
                isFavorite: true,
            },
        }), 'countFavoritesByUser');
    }
    async getMeanRatingByUser(userId) {
        const aggregate = await this.prismaService.journalEntry.aggregate({
            where: {
                userId,
                rating: { not: null },
            },
            _avg: {
                rating: true,
            },
        });
        return Number(aggregate._avg.rating) || 0;
    }
};
exports.JournalRepository = JournalRepository;
exports.JournalRepository = JournalRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(base_repository_1.PRISMA_TRANSACTION)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], JournalRepository);
//# sourceMappingURL=journal.repository.js.map