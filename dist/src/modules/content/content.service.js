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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../common/services/base.service");
const content_repository_1 = require("./content.repository");
const entities_1 = require("./entities");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
let ContentService = class ContentService extends base_service_1.BaseService {
    contentRepository;
    constructor(contentRepository) {
        super();
        this.contentRepository = contentRepository;
    }
    async browse(query) {
        const genres = query.genres
            ? query.genres.split(',').map((g) => g.trim())
            : [];
        const result = await this.contentRepository.findPaginatedContent({
            page: query.page,
            limit: query.limit,
            type: query.type === 'ALL' ? undefined : query.type,
            genres,
            sort: query.sort,
            order: query.order,
        });
        const contentIds = result.items.map((item) => item.id);
        const avgRatings = await this.contentRepository.getAverageRatings(contentIds);
        const entities = result.items.map((item) => {
            const payload = item;
            const entity = (0, entities_1.toContentEntity)(item);
            entity.avgRating = avgRatings[item.id] || 0;
            entity.loggedCount = payload._count?.journalEntries || 0;
            return entity;
        });
        return this.success(new paginated_response_dto_1.PaginatedResponseDto(entities, result.meta.total, result.meta.page, result.meta.limit));
    }
    async search(q, limit = 10) {
        const items = await this.contentRepository.searchByTitle(q, limit);
        const contentIds = items.map((item) => item.id);
        const avgRatings = await this.contentRepository.getAverageRatings(contentIds);
        const entities = items.map((item) => {
            const payload = item;
            const entity = (0, entities_1.toContentEntity)(item);
            entity.avgRating = avgRatings[item.id] || 0;
            entity.loggedCount = payload._count?.journalEntries || 0;
            return entity;
        });
        return this.success({ items: entities });
    }
    async getDetail(slug, userId) {
        let content;
        if (userId) {
            content = await this.contentRepository.findBySlugWithUserEntry(slug, userId);
        }
        else {
            content = await this.contentRepository.findBySlug(slug);
        }
        if (!content) {
            return this.notFound('Content not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        const payload = content;
        const avgRatings = await this.contentRepository.getAverageRatings([
            content.id,
        ]);
        const entity = (0, entities_1.toContentEntity)(content);
        entity.avgRating = avgRatings[content.id] || 0;
        entity.loggedCount = payload._count?.journalEntries || 0;
        if (payload.journalEntries && payload.journalEntries.length > 0) {
            entity.userEntry = payload.journalEntries[0];
        }
        else {
            entity.userEntry = null;
        }
        return this.success(entity);
    }
    async getFeatured() {
        const [featured, recentlyAdded, topRated] = await Promise.all([
            this.contentRepository.findFeatured(),
            this.contentRepository.findRecentlyAdded(),
            this.contentRepository.findTopRated(),
        ]);
        const allItems = [...featured, ...recentlyAdded, ...topRated];
        const contentIds = Array.from(new Set(allItems.map((item) => item.id)));
        const avgRatings = await this.contentRepository.getAverageRatings(contentIds);
        const mapToEntity = (item) => {
            const payload = item;
            const entity = (0, entities_1.toContentEntity)(item);
            entity.avgRating = avgRatings[payload.id] || 0;
            entity.loggedCount = payload._count?.journalEntries || 0;
            return entity;
        };
        return this.success({
            featured: featured.map(mapToEntity),
            recentlyAdded: recentlyAdded.map(mapToEntity),
            topRated: topRated.map(mapToEntity),
        });
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository])
], ContentService);
//# sourceMappingURL=content.service.js.map