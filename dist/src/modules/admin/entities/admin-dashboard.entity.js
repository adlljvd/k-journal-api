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
exports.AdminDashboardEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const content_request_entity_1 = require("../../content-request/entities/content-request.entity");
class AdminDashboardEntity {
    pendingRequestsCount;
    totalContentCount;
    recentRequests;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.AdminDashboardEntity = AdminDashboardEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AdminDashboardEntity.prototype, "pendingRequestsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AdminDashboardEntity.prototype, "totalContentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [content_request_entity_1.ContentRequestEntity] }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => content_request_entity_1.ContentRequestEntity),
    __metadata("design:type", Array)
], AdminDashboardEntity.prototype, "recentRequests", void 0);
//# sourceMappingURL=admin-dashboard.entity.js.map