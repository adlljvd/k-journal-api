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
exports.PublicProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_profile_entity_1 = require("../../user/entities/user-profile.entity");
const content_entity_1 = require("../../content/entities/content.entity");
const profile_stats_dto_1 = require("./profile-stats.dto");
let PublicProfileDto = class PublicProfileDto {
    id;
    username;
    profile;
    profileFavorites;
    stats;
};
exports.PublicProfileDto = PublicProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kdrama_fan' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PublicProfileDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_profile_entity_1.UserProfileEntity }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => user_profile_entity_1.UserProfileEntity),
    __metadata("design:type", user_profile_entity_1.UserProfileEntity)
], PublicProfileDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [content_entity_1.ContentEntity],
        description: 'Profile favorites (up to 4)',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => content_entity_1.ContentEntity),
    __metadata("design:type", Array)
], PublicProfileDto.prototype, "profileFavorites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: profile_stats_dto_1.ProfileStatsDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => profile_stats_dto_1.ProfileStatsDto),
    __metadata("design:type", profile_stats_dto_1.ProfileStatsDto)
], PublicProfileDto.prototype, "stats", void 0);
exports.PublicProfileDto = PublicProfileDto = __decorate([
    (0, class_transformer_1.Exclude)()
], PublicProfileDto);
//# sourceMappingURL=public-profile.dto.js.map