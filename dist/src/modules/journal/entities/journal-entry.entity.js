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
exports.JournalEntryEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const watch_status_enum_1 = require("../../../common/enums/watch-status.enum");
const content_entity_1 = require("../../content/entities/content.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let JournalEntryEntity = class JournalEntryEntity {
    id;
    userId;
    contentId;
    status;
    rating;
    review;
    isFavorite;
    createdAt;
    updatedAt;
    content;
    user;
    constructor(partial) {
        if (partial) {
            const { content, user, rating, ...rest } = partial;
            Object.assign(this, rest);
            if (rating !== undefined) {
                this.rating = rating !== null ? Number(rating) : null;
            }
            if (content) {
                this.content = new content_entity_1.ContentEntity(content);
            }
            if (user) {
                this.user = new user_entity_1.UserEntity(user);
            }
            if (user) {
                this.user = new user_entity_1.UserEntity(user);
            }
        }
    }
};
exports.JournalEntryEntity = JournalEntryEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], JournalEntryEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], JournalEntryEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], JournalEntryEntity.prototype, "contentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: watch_status_enum_1.WatchStatus, example: watch_status_enum_1.WatchStatus.COMPLETED }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], JournalEntryEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4.5, minimum: 0.5, maximum: 5.0 }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], JournalEntryEntity.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A masterpiece of storytelling.' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], JournalEntryEntity.prototype, "review", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], JournalEntryEntity.prototype, "isFavorite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], JournalEntryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], JournalEntryEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => content_entity_1.ContentEntity }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => content_entity_1.ContentEntity),
    __metadata("design:type", content_entity_1.ContentEntity)
], JournalEntryEntity.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_entity_1.UserEntity }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => user_entity_1.UserEntity),
    __metadata("design:type", user_entity_1.UserEntity)
], JournalEntryEntity.prototype, "user", void 0);
exports.JournalEntryEntity = JournalEntryEntity = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], JournalEntryEntity);
//# sourceMappingURL=journal-entry.entity.js.map