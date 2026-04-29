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
exports.ProfileStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let ProfileStatsDto = class ProfileStatsDto {
    totalLogged;
    meanRating;
    favoritesCount;
};
exports.ProfileStatsDto = ProfileStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42, description: 'Total content logged' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ProfileStatsDto.prototype, "totalLogged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 4.2,
        description: 'Mean rating across all rated entries',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ProfileStatsDto.prototype, "meanRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Number of favorite entries' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ProfileStatsDto.prototype, "favoritesCount", void 0);
exports.ProfileStatsDto = ProfileStatsDto = __decorate([
    (0, class_transformer_1.Exclude)()
], ProfileStatsDto);
//# sourceMappingURL=profile-stats.dto.js.map