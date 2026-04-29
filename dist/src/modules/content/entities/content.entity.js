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
exports.ContentEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const content_type_enum_1 = require("../../../common/enums/content-type.enum");
const class_transformer_1 = require("class-transformer");
let ContentEntity = class ContentEntity {
    id;
    title;
    slug;
    type;
    year;
    synopsis;
    posterUrl;
    genres;
    cast;
    episodes;
    durationMinutes;
    country;
    isFeatured;
    avgRating = 0;
    loggedCount = 0;
    userEntry;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
        if (typeof this.genres === 'string') {
            try {
                const parsed = JSON.parse(this.genres);
                this.genres = Array.isArray(parsed) ? parsed : [];
            }
            catch {
                this.genres = [];
            }
        }
        else if (!this.genres) {
            this.genres = [];
        }
    }
};
exports.ContentEntity = ContentEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Crash Landing on You' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentEntity.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'crash-landing-on-you' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentEntity.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: content_type_enum_1.ContentType, example: content_type_enum_1.ContentType.DRAMA }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2019 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ContentEntity.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'A paragliding mishap drops a South Korean heiress in North Korea...',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentEntity.prototype, "synopsis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/poster.jpg' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentEntity.prototype, "posterUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Romance', 'Comedy', 'Drama'] }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], ContentEntity.prototype, "genres", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hyun Bin, Son Ye-jin' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentEntity.prototype, "cast", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 16,
        description: 'For dramas: total episodes',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentEntity.prototype, "episodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 120,
        description: 'For movies: duration in minutes',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentEntity.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'South Korea' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentEntity.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ContentEntity.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4.5 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ContentEntity.prototype, "avgRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ContentEntity.prototype, "loggedCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'WATCHING',
            rating: 4.5,
            review: 'Great show!',
            isFavorite: true,
        },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentEntity.prototype, "userEntry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ContentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ContentEntity.prototype, "updatedAt", void 0);
exports.ContentEntity = ContentEntity = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ContentEntity);
//# sourceMappingURL=content.entity.js.map