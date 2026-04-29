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
exports.UserProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let UserProfileRepository = class UserProfileRepository extends base_repository_1.BaseRepository {
    constructor(prismaService, transactionClient) {
        super(prismaService, transactionClient);
    }
    getModel() {
        return this.prismaService.userProfile;
    }
    async findByUserId(userId) {
        return this.withRetry(() => this.getClient().findUnique({ where: { userId } }), 'findByUserId');
    }
    async findByUserIdWithFavorites(userId) {
        const profile = await this.findByUserId(userId);
        if (!profile) {
            return null;
        }
        if (!profile.profileFavorites) {
            return { ...profile, favorites: [] };
        }
        const favoriteIds = profile.profileFavorites;
        if (favoriteIds.length === 0) {
            return { ...profile, favorites: [] };
        }
        const favorites = await this.prismaService.content.findMany({
            where: {
                id: { in: favoriteIds },
            },
        });
        return {
            ...profile,
            favorites,
        };
    }
};
exports.UserProfileRepository = UserProfileRepository;
exports.UserProfileRepository = UserProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(base_repository_1.PRISMA_TRANSACTION)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], UserProfileRepository);
//# sourceMappingURL=user-profile.repository.js.map