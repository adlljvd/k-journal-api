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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const user_repository_1 = require("../modules/user/user.repository");
const user_profile_repository_1 = require("../modules/user/user-profile.repository");
const user_entity_1 = require("../modules/user/entities/user.entity");
const error_code_enum_1 = require("../common/enums/error-code.enum");
const role_enum_1 = require("../common/enums/role.enum");
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_DEFAULT_DAYS = 7;
const REFRESH_TOKEN_REMEMBER_ME_DAYS = 30;
const PASSWORD_RESET_EXPIRES_HOURS = 24;
let AuthService = AuthService_1 = class AuthService {
    userRepository;
    profileRepository;
    prismaService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userRepository, profileRepository, prismaService, jwtService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.prismaService = prismaService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingEmail = await this.userRepository.findByEmail(dto.email);
        if (existingEmail) {
            throw new common_1.ConflictException({
                code: error_code_enum_1.ErrorCode.EMAIL_ALREADY_EXISTS,
                message: 'An account with this email already exists.',
            });
        }
        const existingUsername = await this.userRepository.findByUsername(dto.username);
        if (existingUsername) {
            throw new common_1.ConflictException({
                code: error_code_enum_1.ErrorCode.USERNAME_ALREADY_EXISTS,
                message: 'This username is already taken.',
            });
        }
        const passwordHash = await argon2.hash(dto.password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });
        const user = await this.prismaService.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: dto.email.toLowerCase(),
                    username: dto.username,
                    passwordHash,
                    role: role_enum_1.Role.USER,
                },
                include: { profile: true },
            });
            await tx.userProfile.create({
                data: {
                    userId: newUser.id,
                    avatarUrl: null,
                    bio: null,
                    profileFavorites: [],
                },
            });
            return newUser;
        });
        const userWithProfile = await this.userRepository.findByIdWithProfile(user.id);
        const tokens = await this.generateTokens(user.id, user.email, user.role, false);
        return {
            user: new user_entity_1.UserEntity(userWithProfile),
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException({
                code: error_code_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS,
                message: 'Invalid email or password. Please try again.',
            });
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException({
                code: error_code_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS,
                message: 'Invalid email or password. Please try again.',
            });
        }
        const userWithProfile = await this.userRepository.findByIdWithProfile(user.id);
        const tokens = await this.generateTokens(user.id, user.email, user.role, dto.rememberMe ?? false);
        return {
            user: new user_entity_1.UserEntity(userWithProfile),
            ...tokens,
        };
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.prismaService.refreshToken.deleteMany({
            where: { tokenHash },
        });
    }
    async refreshTokens(dto) {
        const tokenHash = this.hashToken(dto.refreshToken);
        const storedToken = await this.prismaService.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException({
                code: error_code_enum_1.ErrorCode.AUTH_TOKEN_INVALID,
                message: 'Invalid refresh token.',
            });
        }
        if (storedToken.expiresAt < new Date()) {
            await this.prismaService.refreshToken.delete({
                where: { id: storedToken.id },
            });
            throw new common_1.UnauthorizedException({
                code: error_code_enum_1.ErrorCode.AUTH_TOKEN_EXPIRED,
                message: 'Refresh token has expired.',
            });
        }
        await this.prismaService.refreshToken.delete({
            where: { id: storedToken.id },
        });
        const daysDiff = Math.ceil((storedToken.expiresAt.getTime() - storedToken.createdAt.getTime()) /
            (1000 * 60 * 60 * 24));
        const rememberMe = daysDiff > REFRESH_TOKEN_DEFAULT_DAYS;
        return this.generateTokens(storedToken.user.id, storedToken.user.email, storedToken.user.role, rememberMe);
    }
    async forgotPassword(dto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            return {
                message: 'If an account exists with this email, you will receive a reset link.',
            };
        }
        const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const resetTokenHash = this.hashToken(resetToken);
        const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRES_HOURS * 60 * 60 * 1000);
        this.logger.log(`Password reset token generated for user ${user.id}: ${resetToken}`);
        this.logger.log(`Token hash: ${resetTokenHash}, Expires: ${expiresAt.toISOString()}`);
        return {
            message: 'If an account exists with this email, you will receive a reset link.',
        };
    }
    resetPassword(dto) {
        this.hashToken(dto.token);
        throw new common_1.BadRequestException({
            code: error_code_enum_1.ErrorCode.INVALID_TOKEN,
            message: 'Invalid or expired reset token.',
        });
    }
    async generateTokens(userId, email, role, rememberMe) {
        const payload = {
            sub: userId,
            email,
            role,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });
        const refreshDays = rememberMe
            ? REFRESH_TOKEN_REMEMBER_ME_DAYS
            : REFRESH_TOKEN_DEFAULT_DAYS;
        const refreshExpiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);
        const refreshToken = (0, crypto_1.randomBytes)(64).toString('hex');
        const refreshTokenHash = this.hashToken(refreshToken);
        await this.prismaService.refreshToken.create({
            data: {
                userId,
                tokenHash: refreshTokenHash,
                expiresAt: refreshExpiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_profile_repository_1.UserProfileRepository,
        prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map