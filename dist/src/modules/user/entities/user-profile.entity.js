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
exports.UserProfileEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let UserProfileEntity = class UserProfileEntity {
    userId;
    avatarUrl;
    bio;
    profileFavorites;
    createdAt;
    updatedAt;
    constructor(partial) {
        if (partial) {
            const { profileFavorites, ...rest } = partial;
            Object.assign(this, rest);
            this.profileFavorites = profileFavorites;
        }
    }
};
exports.UserProfileEntity = UserProfileEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserProfileEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://example.com/avatar.jpg',
        nullable: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserProfileEntity.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'K-drama enthusiast', nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserProfileEntity.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['550e8400-e29b-41d4-a716-446655440001'],
        type: [String],
        nullable: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserProfileEntity.prototype, "profileFavorites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UserProfileEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UserProfileEntity.prototype, "updatedAt", void 0);
exports.UserProfileEntity = UserProfileEntity = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], UserProfileEntity);
//# sourceMappingURL=user-profile.entity.js.map