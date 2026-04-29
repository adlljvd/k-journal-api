"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const base_service_1 = require("../../common/services/base.service");
const user_repository_1 = require("./user.repository");
const user_profile_repository_1 = require("./user-profile.repository");
const user_entity_1 = require("./entities/user.entity");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
let UserService = class UserService extends base_service_1.BaseService {
    userRepository;
    profileRepository;
    prismaService;
    constructor(userRepository, profileRepository, prismaService) {
        super();
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.prismaService = prismaService;
    }
    async getCurrentUser(userId) {
        const user = await this.userRepository.findByIdWithProfile(userId);
        if (!user) {
            return this.notFound('User not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        return this.success(new user_entity_1.UserEntity(user));
    }
    async updateProfile(userId, dto) {
        const profile = await this.profileRepository.findByUserId(userId);
        if (!profile) {
            return this.notFound('Profile not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        if (dto.profileFavorites) {
            if (dto.profileFavorites.length > 4) {
                return this.validationError('Maximum 4 profile favorites allowed');
            }
            const contentCount = await this.prismaService.content.count({
                where: { id: { in: dto.profileFavorites } },
            });
            if (contentCount !== dto.profileFavorites.length) {
                return this.validationError('One or more favorite content items not found');
            }
        }
        await this.profileRepository.update({ userId }, {
            avatarUrl: dto.avatarUrl,
            bio: dto.bio,
            profileFavorites: dto.profileFavorites,
        });
        return this.getCurrentUser(userId);
    }
    async changePassword(userId, dto) {
        const user = await this.userRepository.findById({ id: userId });
        if (!user) {
            return this.notFound('User not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, dto.currentPassword);
        if (!isPasswordValid) {
            return this.error(error_code_enum_1.ErrorCode.INVALID_CURRENT_PASSWORD, 'Invalid current password');
        }
        const newPasswordHash = await argon2.hash(dto.newPassword);
        await this.userRepository.updatePassword(userId, newPasswordHash);
        return this.success(undefined);
    }
    async changeEmail(userId, dto) {
        const user = await this.userRepository.findById({ id: userId });
        if (!user) {
            return this.notFound('User not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            return this.error(error_code_enum_1.ErrorCode.INVALID_PASSWORD, 'Invalid password');
        }
        const existingUser = await this.userRepository.findByEmail(dto.newEmail);
        if (existingUser && existingUser.id !== userId) {
            return this.conflict(error_code_enum_1.ErrorCode.EMAIL_ALREADY_EXISTS, 'An account with this email already exists');
        }
        await this.userRepository.updateEmail(userId, dto.newEmail);
        return this.success(undefined);
    }
    async deleteAccount(userId, dto) {
        const user = await this.userRepository.findById({ id: userId });
        if (!user) {
            return this.notFound('User not found', error_code_enum_1.ErrorCode.USER_NOT_FOUND);
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            return this.error(error_code_enum_1.ErrorCode.INVALID_PASSWORD, 'Invalid password');
        }
        await this.userRepository.deleteUser(userId);
        return this.success(undefined);
    }
    async calculateStats(userId) {
        const [totalLogged, favoritesCount, ratings] = await Promise.all([
            this.prismaService.journalEntry.count({ where: { userId } }),
            this.prismaService.journalEntry.count({
                where: { userId, isFavorite: true },
            }),
            this.prismaService.journalEntry.findMany({
                where: { userId, rating: { not: null } },
                select: { rating: true },
            }),
        ]);
        const meanRating = ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + Number(curr.rating), 0) /
                ratings.length
            : 0;
        return this.success({
            totalLogged,
            meanRating: parseFloat(meanRating.toFixed(1)),
            favoritesCount,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_profile_repository_1.UserProfileRepository,
        prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map