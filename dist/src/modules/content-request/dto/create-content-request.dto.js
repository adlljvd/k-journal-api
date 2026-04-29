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
exports.CreateContentRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const content_type_enum_1 = require("../../../common/enums/content-type.enum");
class CreateContentRequestDto {
    title;
    type;
    year;
    notes;
}
exports.CreateContentRequestDto = CreateContentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'My Love from the Star',
        description: 'Title of the requested content (1-255 chars)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateContentRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: content_type_enum_1.ContentType,
        example: content_type_enum_1.ContentType.DRAMA,
        description: 'Type of content (DRAMA or MOVIE)',
    }),
    (0, class_validator_1.IsEnum)(content_type_enum_1.ContentType),
    __metadata("design:type", String)
], CreateContentRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 2013,
        description: 'Release year (optional)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateContentRequestDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Please add this drama, it is a classic!',
        description: 'Additional notes (optional)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=create-content-request.dto.js.map