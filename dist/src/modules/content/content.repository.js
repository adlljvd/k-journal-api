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
exports.ContentRepository = exports.CONTENT_INCLUDE = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
exports.CONTENT_INCLUDE = {
    _count: {
        select: {
            journalEntries: true,
        },
    },
};
let ContentRepository = class ContentRepository extends base_repository_1.BaseRepository {
    constructor(prismaService, transactionClient) {
        super(prismaService, transactionClient);
    }
    getModel() {
        return this.prismaService.content;
    }
    async findBySlug(slug) {
        return this.withRetry(() => this.getClient().findUnique({
            where: { slug },
            include: exports.CONTENT_INCLUDE,
        }), 'findBySlug');
    }
    async findBySlugWithUserEntry(slug, userId) {
        return this.withRetry(() => this.getClient().findUnique({
            where: { slug },
            include: {
                ...exports.CONTENT_INCLUDE,
                journalEntries: {
                    where: { userId },
                    take: 1,
                },
            },
        }), 'findBySlugWithUserEntry');
    }
    async findByIdWithUserEntry(id, userId) {
        return this.withRetry(() => this.getClient().findUnique({
            where: { id },
            include: {
                ...exports.CONTENT_INCLUDE,
                journalEntries: {
                    where: { userId },
                    take: 1,
                },
            },
        }), 'findByIdWithUserEntry');
    }
    async findPaginatedContent(options) {
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(Math.max(1, options.limit ?? 20), 100);
        const skip = (page - 1) * limit;
        const { type, genres, sort = 'title', order = 'asc' } = options;
        const where = {
            ...(type && type !== 'ALL' && { type: type }),
            ...(genres &&
                genres.length > 0 && {
                AND: genres.map((genre) => ({
                    genres: {
                        array_contains: genre,
                    },
                })),
            }),
        };
        let orderBy = {};
        if (sort === 'title') {
            orderBy = { title: order };
        }
        else if (sort === 'year') {
            orderBy = { year: order };
        }
        else if (sort === 'rating') {
            return this.findPaginatedWithRatingSort({
                where,
                page,
                limit,
                order,
                type,
                genres,
            });
        }
        const [items, total] = await Promise.all([
            this.withRetry(() => this.getClient().findMany({
                where,
                include: exports.CONTENT_INCLUDE,
                orderBy,
                skip,
                take: limit,
            }), 'findPaginatedContent.items'),
            this.withRetry(() => this.getClient().count({ where }), 'findPaginatedContent.count'),
        ]);
        return new paginated_response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async searchByTitle(q, limit = 10) {
        return this.withRetry(() => this.getClient().findMany({
            where: {
                title: {
                    contains: q,
                    mode: 'insensitive',
                },
            },
            take: limit,
            include: exports.CONTENT_INCLUDE,
        }), 'searchByTitle');
    }
    async findFeatured() {
        return this.withRetry(() => this.getClient().findMany({
            where: { isFeatured: true },
            include: exports.CONTENT_INCLUDE,
        }), 'findFeatured');
    }
    async findRecentlyAdded(limit = 6) {
        return this.withRetry(() => this.getClient().findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: exports.CONTENT_INCLUDE,
        }), 'findRecentlyAdded');
    }
    async findPaginatedWithRatingSort(options) {
        const { page, limit, order, type, genres } = options;
        const skip = (page - 1) * limit;
        const whereConditions = [];
        if (type && type !== 'ALL') {
            whereConditions.push(`c.type = '${type}'`);
        }
        if (genres && genres.length > 0) {
            for (const genre of genres) {
                whereConditions.push(`c.genres @> '["${genre}"]'::jsonb`);
            }
        }
        const whereClause = whereConditions.length > 0
            ? client_1.Prisma.raw(`WHERE ${whereConditions.join(' AND ')}`)
            : client_1.Prisma.empty;
        const items = await this.prismaService.$queryRaw `
      SELECT c.*
      FROM "Content" c
      LEFT JOIN "JournalEntry" j ON c.id = j."contentId"
      ${whereClause}
      GROUP BY c.id
      ORDER BY AVG(j.rating) ${client_1.Prisma.raw(order)} NULLS LAST
      LIMIT ${limit} OFFSET ${skip}
    `;
        const total = await this.getClient().count({ where: options.where });
        return new paginated_response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async getAverageRatings(contentIds) {
        const averages = await this.prismaService.journalEntry.groupBy({
            by: ['contentId'],
            where: {
                contentId: { in: contentIds },
                rating: { not: null },
            },
            _avg: {
                rating: true,
            },
        });
        const result = {};
        for (const avg of averages) {
            result[avg.contentId] = Number(avg._avg.rating) || 0;
        }
        return result;
    }
    async findTopRated(limit = 10, minRatings = 5) {
        const topRatedGroups = await this.prismaService.journalEntry.groupBy({
            by: ['contentId'],
            _avg: {
                rating: true,
            },
            _count: {
                _all: true,
            },
            having: {
                rating: {
                    _count: {
                        gte: minRatings,
                    },
                },
            },
            orderBy: {
                _avg: {
                    rating: 'desc',
                },
            },
            take: limit,
        });
        const contentIds = topRatedGroups.map((g) => g.contentId);
        if (contentIds.length === 0) {
            return [];
        }
        const contents = await this.getClient().findMany({
            where: { id: { in: contentIds } },
            include: exports.CONTENT_INCLUDE,
        });
        const orderedContents = [];
        for (const id of contentIds) {
            const content = contents.find((c) => c.id === id);
            if (content) {
                orderedContents.push(content);
            }
        }
        return orderedContents;
    }
};
exports.ContentRepository = ContentRepository;
exports.ContentRepository = ContentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(base_repository_1.PRISMA_TRANSACTION)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ContentRepository);
//# sourceMappingURL=content.repository.js.map