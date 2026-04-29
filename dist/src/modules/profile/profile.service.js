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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../common/services/base.service");
const user_1 = require("../user");
const journal_1 = require("../journal");
const content_1 = require("../content");
const prisma_service_1 = require("../../prisma/prisma.service");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
const dto_1 = require("./dto");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
let ProfileService = class ProfileService extends base_service_1.BaseService {
    userRepository;
    profileRepository;
    journalRepository;
    contentRepository;
    prismaService;
    constructor(userRepository, profileRepository, journalRepository, contentRepository, prismaService) {
        super();
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.journalRepository = journalRepository;
        this.contentRepository = contentRepository;
        this.prismaService = prismaService;
    }
    async getProfile(username) {
        const user = await this.findUserByUsernameCaseInsensitive(username);
        if (!user) {
            return this.notFound('User not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        const [profile, stats, profileFavorites] = await Promise.all([
            this.profileRepository.findByUserId(user.id),
            this.calculateStats(user.id),
            this.getProfileFavoritesContent(user.id),
        ]);
        const publicProfile = new dto_1.PublicProfileDto();
        publicProfile.id = user.id;
        publicProfile.username = user.username;
        publicProfile.profile = profile
            ? {
                userId: profile.userId,
                avatarUrl: profile.avatarUrl,
                bio: profile.bio,
                profileFavorites: profile.profileFavorites,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            }
            : undefined;
        publicProfile.profileFavorites = profileFavorites;
        publicProfile.stats = stats;
        return this.success(publicProfile);
    }
    async getPublicJournal(username, query) {
        const user = await this.findUserByUsernameCaseInsensitive(username);
        if (!user) {
            return this.notFound('User not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        const result = await this.journalRepository.findPaginatedByUser({
            userId: user.id,
            page: query.page,
            limit: query.limit,
            status: query.status,
            sort: query.sort,
            order: query.order,
        });
        const entities = result.items.map((entry) => new journal_1.JournalEntryEntity(entry));
        return this.success(new paginated_response_dto_1.PaginatedResponseDto(entities, result.meta.total, result.meta.page, result.meta.limit));
    }
    async searchUsers(query) {
        const limit = query.limit ?? 10;
        const users = await this.prismaService.user.findMany({
            where: {
                username: {
                    contains: query.q,
                    mode: 'insensitive',
                },
            },
            take: limit,
            include: {
                profile: true,
            },
        });
        const items = users.map((user) => {
            const result = new dto_1.UserSearchResultDto();
            result.id = user.id;
            result.username = user.username;
            result.profile = user.profile
                ? {
                    avatarUrl: user.profile.avatarUrl,
                    bio: user.profile.bio,
                }
                : undefined;
            return result;
        });
        return this.success({ items });
    }
    async calculateStats(userId) {
        const [totalLogged, favoritesCount, meanRating] = await Promise.all([
            this.journalRepository.countTotalByUser(userId),
            this.journalRepository.countFavoritesByUser(userId),
            this.journalRepository.getMeanRatingByUser(userId),
        ]);
        const stats = new dto_1.ProfileStatsDto();
        stats.totalLogged = totalLogged;
        stats.meanRating = parseFloat(meanRating.toFixed(1));
        stats.favoritesCount = favoritesCount;
        return stats;
    }
    async findUserByUsernameCaseInsensitive(username) {
        const user = await this.prismaService.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive',
                },
            },
        });
        return user;
    }
    async getProfileFavoritesContent(userId) {
        const profile = await this.profileRepository.findByUserId(userId);
        if (!profile || !profile.profileFavorites) {
            return undefined;
        }
        const favoriteIds = profile.profileFavorites;
        if (favoriteIds.length === 0) {
            return undefined;
        }
        const contents = await this.contentRepository.findMany({
            id: { in: favoriteIds },
        });
        const orderedContents = favoriteIds
            .map((id) => contents.find((c) => c.id === id))
            .filter(Boolean);
        return orderedContents.map((content) => new content_1.ContentEntity(content));
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_1.UserRepository,
        user_1.UserProfileRepository,
        journal_1.JournalRepository,
        content_1.ContentRepository,
        prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map