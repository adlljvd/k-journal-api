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
exports.ContentRequestEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const content_type_enum_1 = require("../../../common/enums/content-type.enum");
const request_status_enum_1 = require("../../../common/enums/request-status.enum");
const class_transformer_1 = require("class-transformer");
let ContentRequestEntity = class ContentRequestEntity {
    id;
    userId;
    title;
    type;
    year;
    notes;
    status;
    rejectionReason;
    contentId;
    createdAt;
    reviewedAt;
    reviewedBy;
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.ContentRequestEntity = ContentRequestEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentRequestEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentRequestEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Love from the Star' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentRequestEntity.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: content_type_enum_1.ContentType, example: content_type_enum_1.ContentType.DRAMA }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentRequestEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2013 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentRequestEntity.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Please add this drama, it is a classic!' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentRequestEntity.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: request_status_enum_1.RequestStatus, example: request_status_enum_1.RequestStatus.PENDING }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ContentRequestEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'This title is already in the catalog.' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentRequestEntity.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentRequestEntity.prototype, "contentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ContentRequestEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-02T00:00:00Z' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Object)
], ContentRequestEntity.prototype, "reviewedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ContentRequestEntity.prototype, "reviewedBy", void 0);
exports.ContentRequestEntity = ContentRequestEntity = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ContentRequestEntity);
//# sourceMappingURL=content-request.entity.js.map