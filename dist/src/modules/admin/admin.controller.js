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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const admin_service_1 = require("./admin.service");
const admin_content_service_1 = require("./admin-content.service");
const admin_content_request_service_1 = require("./admin-content-request.service");
const dto_1 = require("./dto");
const admin_dashboard_entity_1 = require("./entities/admin-dashboard.entity");
const content_request_entity_1 = require("../content-request/entities/content-request.entity");
const content_entity_1 = require("../content/entities/content.entity");
let AdminController = class AdminController {
    adminService;
    adminContentService;
    adminContentRequestService;
    constructor(adminService, adminContentService, adminContentRequestService) {
        this.adminService = adminService;
        this.adminContentService = adminContentService;
        this.adminContentRequestService = adminContentRequestService;
    }
    getDashboard() {
        return this.adminService.getDashboard();
    }
    getAllRequests(page, limit, status) {
        return this.adminContentRequestService.getAllRequests({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status,
        });
    }
    approveRequest(id, req, dto) {
        return this.adminContentRequestService.approveRequest(id, req.user.userId, dto);
    }
    rejectRequest(id, req, dto) {
        return this.adminContentRequestService.rejectRequest(id, req.user.userId, dto);
    }
    createContent(dto) {
        return this.adminContentService.createContent(dto);
    }
    updateContent(id, dto) {
        return this.adminContentService.updateContent(id, dto);
    }
    deleteContent(id) {
        return this.adminContentService.deleteContent(id);
    }
    listContent(query) {
        return this.adminContentService.listContent(query);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: admin_dashboard_entity_1.AdminDashboardEntity }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('content-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all content requests (admin view)' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllRequests", null);
__decorate([
    (0, common_1.Post)('content-requests/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve content request' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.ApproveRequestDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Post)('content-requests/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject content request' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: content_request_entity_1.ContentRequestEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.RejectRequestDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Post)('content'),
    (0, swagger_1.ApiOperation)({ summary: 'Create content directly' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: content_entity_1.ContentEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateContentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createContent", null);
__decorate([
    (0, common_1.Patch)('content/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update content' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: content_entity_1.ContentEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateContentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)('content/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete content' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)('content'),
    (0, swagger_1.ApiOperation)({ summary: 'List all content for admin management' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryAdminContentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listContent", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        admin_content_service_1.AdminContentService,
        admin_content_request_service_1.AdminContentRequestService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map