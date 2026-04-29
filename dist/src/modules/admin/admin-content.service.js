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
exports.AdminContentService = void 0;
const common_1 = require("@nestjs/common");
const content_repository_1 = require("../content/content.repository");
const entities_1 = require("../content/entities");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
let AdminContentService = class AdminContentService {
    contentRepository;
    constructor(contentRepository) {
        this.contentRepository = contentRepository;
    }
    async createContent(dto) {
        const slug = dto.slug || this.slugify(dto.title);
        const existing = await this.contentRepository.findBySlug(slug);
        if (existing) {
            throw new common_1.ConflictException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content with slug ${slug} already exists`,
            });
        }
        const content = await this.contentRepository.create({
            title: dto.title,
            slug,
            type: dto.type,
            year: dto.year,
            synopsis: dto.synopsis,
            posterUrl: dto.posterUrl,
            genres: dto.genres,
            cast: dto.cast,
            episodes: dto.episodes,
            durationMinutes: dto.durationMinutes,
            country: dto.country || 'South Korea',
            isFeatured: dto.isFeatured || false,
        });
        return (0, entities_1.toContentEntity)(content);
    }
    async updateContent(id, dto) {
        const existing = await this.contentRepository.findById({ id });
        if (!existing) {
            throw new common_1.NotFoundException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content with ID ${id} not found`,
            });
        }
        if (dto.slug) {
            const slugConflict = await this.contentRepository.findBySlug(dto.slug);
            if (slugConflict && slugConflict.id !== id) {
                throw new common_1.ConflictException({
                    code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                    message: `Content with slug ${dto.slug} already exists`,
                });
            }
        }
        const updated = await this.contentRepository.update({ id }, {
            ...dto,
            genres: dto.genres,
        });
        return (0, entities_1.toContentEntity)(updated);
    }
    async deleteContent(id) {
        const existing = await this.contentRepository.findById({ id });
        if (!existing) {
            throw new common_1.NotFoundException({
                code: error_code_enum_1.ErrorCode.VALIDATION_FAILED,
                message: `Content with ID ${id} not found`,
            });
        }
        await this.contentRepository.delete({ id });
    }
    async listContent(query) {
        const { page, limit, search, type, sort, order } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(search && {
                title: {
                    contains: search,
                    mode: 'insensitive',
                },
            }),
            ...(type && type !== 'ALL' && { type }),
        };
        const [items, total] = await Promise.all([
            this.contentRepository.findMany(where, {
                skip,
                take: limit,
                orderBy: { [sort || 'createdAt']: order || 'desc' },
            }),
            this.contentRepository.count(where),
        ]);
        return new paginated_response_dto_1.PaginatedResponseDto(items.map((item) => (0, entities_1.toContentEntity)(item)), total, page, limit);
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
exports.AdminContentService = AdminContentService;
exports.AdminContentService = AdminContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository])
], AdminContentService);
//# sourceMappingURL=admin-content.service.js.map