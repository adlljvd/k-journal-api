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
exports.JournalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const journal_service_1 = require("./journal.service");
const entities_1 = require("./entities");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const base_service_1 = require("../../common/services/base.service");
let JournalController = class JournalController extends base_service_1.BaseService {
    journalService;
    constructor(journalService) {
        super();
        this.journalService = journalService;
    }
    async getEntries(req, query) {
        const result = await this.journalService.getEntries(req.user.userId, query);
        this.throwIfError(result);
        return result
            .data;
    }
    async create(req, dto) {
        const result = await this.journalService.create(req.user.userId, dto);
        this.throwIfError(result);
        return result.data;
    }
    async getFavorites(req) {
        const result = await this.journalService.getFavorites(req.user.userId);
        this.throwIfError(result);
        return result.data;
    }
    async setProfileFavorites(req, dto) {
        const result = await this.journalService.setProfileFavorites(req.user.userId, dto);
        this.throwIfError(result);
        return result.data;
    }
    async getEntry(req, id) {
        const result = await this.journalService.getEntry(id, req.user.userId);
        this.throwIfError(result);
        return result.data;
    }
    async update(req, id, dto) {
        const result = await this.journalService.update(id, req.user.userId, dto);
        this.throwIfError(result);
        return result.data;
    }
    async delete(req, id) {
        const result = await this.journalService.delete(id, req.user.userId);
        this.throwIfError(result);
    }
};
exports.JournalController = JournalController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get current user's journal entries" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of journal entries',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.QueryJournalEntryDto]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "getEntries", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new journal entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: entities_1.JournalEntryEntity }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Entry already exists' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateJournalEntryDto]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('favorites'),
    (0, swagger_1.ApiOperation)({ summary: "Get user's favorite entries" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of favorite entries' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "getFavorites", null);
__decorate([
    (0, common_1.Patch)('favorites/profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Set profile favorites' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile favorites updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.SetProfileFavoritesDto]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "setProfileFavorites", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single journal entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: entities_1.JournalEntryEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Entry not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "getEntry", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a journal entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: entities_1.JournalEntryEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Entry not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateJournalEntryDto]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a journal entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Journal entry UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Entry deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Entry not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JournalController.prototype, "delete", null);
exports.JournalController = JournalController = __decorate([
    (0, swagger_1.ApiTags)('Journal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('journal'),
    __metadata("design:paramtypes", [journal_service_1.JournalService])
], JournalController);
//# sourceMappingURL=journal.controller.js.map