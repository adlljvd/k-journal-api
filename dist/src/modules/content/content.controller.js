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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_service_1 = require("./content.service");
const entities_1 = require("./entities");
const dto_1 = require("./dto");
const base_service_1 = require("../../common/services/base.service");
const optional_jwt_auth_guard_1 = require("../../auth/guards/optional-jwt-auth.guard");
let ContentController = class ContentController extends base_service_1.BaseService {
    contentService;
    constructor(contentService) {
        super();
        this.contentService = contentService;
    }
    async browse(query) {
        const result = await this.contentService.browse(query);
        this.throwIfError(result);
        return result.data;
    }
    async search(q, limit) {
        const result = await this.contentService.search(q, limit);
        this.throwIfError(result);
        return result.data;
    }
    async getFeatured() {
        const result = await this.contentService.getFeatured();
        this.throwIfError(result);
        return result.data;
    }
    async getDetail(slug, req) {
        const userId = req.user?.userId;
        const result = await this.contentService.getDetail(slug, userId);
        this.throwIfError(result);
        return result.data;
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Browse content catalog' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of content' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryContentDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "browse", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search content by title' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of matching content' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured content for homepage' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Featured, recently added, and top rated content',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getFeatured", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get content detail' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: entities_1.ContentEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Content not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getDetail", null);
exports.ContentController = ContentController = __decorate([
    (0, swagger_1.ApiTags)('Content'),
    (0, common_1.Controller)('content'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map