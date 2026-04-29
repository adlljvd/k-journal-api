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
exports.JournalService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../common/services/base.service");
const journal_repository_1 = require("./journal.repository");
const content_repository_1 = require("../content/content.repository");
const user_profile_repository_1 = require("../user/user-profile.repository");
const journal_entry_entity_1 = require("./entities/journal-entry.entity");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
let JournalService = class JournalService extends base_service_1.BaseService {
    journalRepository;
    contentRepository;
    profileRepository;
    constructor(journalRepository, contentRepository, profileRepository) {
        super();
        this.journalRepository = journalRepository;
        this.contentRepository = contentRepository;
        this.profileRepository = profileRepository;
    }
    async create(userId, dto) {
        const content = await this.contentRepository.findById({
            id: dto.contentId,
        });
        if (!content) {
            return this.notFound('Content not found', error_code_enum_1.ErrorCode.VALIDATION_FAILED);
        }
        const existing = await this.journalRepository.findByUserAndContent(userId, dto.contentId);
        if (existing) {
            return this.conflict(error_code_enum_1.ErrorCode.ENTRY_ALREADY_EXISTS, 'Journal entry for this content already exists');
        }
        await this.journalRepository.create({
            user: { connect: { id: userId } },
            content: { connect: { id: dto.contentId } },
            status: dto.status,
            rating: dto.rating,
            review: dto.review,
            isFavorite: dto.isFavorite ?? false,
        });
        const fullEntry = await this.journalRepository.findByUserAndContent(userId, dto.contentId);
        return this.success(new journal_entry_entity_1.JournalEntryEntity(fullEntry));
    }
    async getEntries(userId, query) {
        const result = await this.journalRepository.findPaginatedByUser({
            userId,
            page: query.page,
            limit: query.limit,
            status: query.status,
            sort: query.sort,
            order: query.order,
        });
        const entities = result.items.map((item) => new journal_entry_entity_1.JournalEntryEntity(item));
        return this.success(new paginated_response_dto_1.PaginatedResponseDto(entities, result.meta.total, result.meta.page, result.meta.limit));
    }
    async getEntry(id, userId) {
        const entry = await this.journalRepository.findByIdWithOwner(id, userId);
        if (!entry) {
            return this.notFound('Journal entry not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        return this.success(new journal_entry_entity_1.JournalEntryEntity(entry));
    }
    async update(id, userId, dto) {
        const entry = await this.journalRepository.findByIdWithOwner(id, userId);
        if (!entry) {
            return this.notFound('Journal entry not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        await this.journalRepository.update({ id }, dto);
        const fullEntry = await this.journalRepository.findByIdWithOwner(id, userId);
        return this.success(new journal_entry_entity_1.JournalEntryEntity(fullEntry));
    }
    async delete(id, userId) {
        const entry = await this.journalRepository.findByIdWithOwner(id, userId);
        if (!entry) {
            return this.notFound('Journal entry not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        await this.journalRepository.delete({ id });
        return this.success(undefined);
    }
    async getFavorites(userId) {
        const [favorites, profile] = await Promise.all([
            this.journalRepository.findByFavorites(userId),
            this.profileRepository.findByUserId(userId),
        ]);
        const entities = favorites.map((item) => new journal_entry_entity_1.JournalEntryEntity(item));
        const profileFavorites = profile?.profileFavorites || [];
        return this.success({
            items: entities,
            profileFavorites,
        });
    }
    async setProfileFavorites(userId, dto) {
        const entries = await this.journalRepository.findMany({
            id: { in: dto.entryIds },
            userId,
            isFavorite: true,
        });
        if (entries.length !== dto.entryIds.length) {
            return this.validationError('One or more entries not found, not owned by you, or not marked as favorite');
        }
        await this.profileRepository.update({ userId }, { profileFavorites: dto.entryIds });
        return this.success({
            profileFavorites: dto.entryIds,
        });
    }
    async getStats(userId) {
        const [totalLogged, , favoritesCount, meanRating] = await Promise.all([
            this.journalRepository.countTotalByUser(userId),
            this.journalRepository.countRatedByUser(userId),
            this.journalRepository.countFavoritesByUser(userId),
            this.journalRepository.getMeanRatingByUser(userId),
        ]);
        return this.success({
            totalLogged,
            meanRating: parseFloat(meanRating.toFixed(1)),
            favoritesCount,
        });
    }
};
exports.JournalService = JournalService;
exports.JournalService = JournalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [journal_repository_1.JournalRepository,
        content_repository_1.ContentRepository,
        user_profile_repository_1.UserProfileRepository])
], JournalService);
//# sourceMappingURL=journal.service.js.map