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
exports.ContentRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_request_service_1 = require("./content-request.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const base_service_1 = require("../../common/services/base.service");
let ContentRequestController = class ContentRequestController extends base_service_1.BaseService {
    contentRequestService;
    constructor(contentRequestService) {
        super();
        this.contentRequestService = contentRequestService;
    }
    async createRequest(dto, req) {
        const result = await this.contentRequestService.createRequest(req.user.userId, dto);
        this.throwIfError(result);
        return result.data;
    }
    async getMyRequests(query, req) {
        const result = await this.contentRequestService.getMyRequests(req.user.userId, query);
        this.throwIfError(result);
        return result
            .data;
    }
};
exports.ContentRequestController = ContentRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a content request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Request submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Daily limit exceeded (5 requests per user per day)',
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateContentRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ContentRequestController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get user's content requests" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user requests' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryContentRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ContentRequestController.prototype, "getMyRequests", null);
exports.ContentRequestController = ContentRequestController = __decorate([
    (0, swagger_1.ApiTags)('Content Requests'),
    (0, common_1.Controller)('content-requests'),
    __metadata("design:paramtypes", [content_request_service_1.ContentRequestService])
], ContentRequestController);
//# sourceMappingURL=content-request.controller.js.map