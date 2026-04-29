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
exports.CreateJournalEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const watch_status_enum_1 = require("../../../common/enums/watch-status.enum");
const is_rating_decorator_1 = require("../../../common/decorators/is-rating.decorator");
class CreateJournalEntryDto {
    contentId;
    status;
    rating;
    review;
    isFavorite = false;
}
exports.CreateJournalEntryDto = CreateJournalEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "contentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: watch_status_enum_1.WatchStatus, example: watch_status_enum_1.WatchStatus.WATCHING }),
    (0, class_validator_1.IsEnum)(watch_status_enum_1.WatchStatus),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4.5, minimum: 0.5, maximum: 5.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, is_rating_decorator_1.IsRating)(),
    __metadata("design:type", Number)
], CreateJournalEntryDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A masterpiece of storytelling.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalEntryDto.prototype, "review", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJournalEntryDto.prototype, "isFavorite", void 0);
//# sourceMappingURL=create-journal-entry.dto.js.map