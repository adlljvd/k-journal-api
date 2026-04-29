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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const profile_service_1 = require("./profile.service");
const dto_1 = require("./dto");
const base_service_1 = require("../../common/services/base.service");
let ProfileController = class ProfileController extends base_service_1.BaseService {
    profileService;
    constructor(profileService) {
        super();
        this.profileService = profileService;
    }
    async searchUsers(query) {
        const result = await this.profileService.searchUsers(query);
        this.throwIfError(result);
        return result.data;
    }
    async getProfile(username) {
        const result = await this.profileService.getProfile(username);
        this.throwIfError(result);
        return result.data;
    }
    async getPublicJournal(username, query) {
        const result = await this.profileService.getPublicJournal(username, query);
        this.throwIfError(result);
        return result
            .data;
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search users by username' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of matching users',
        type: [dto_1.UserSearchResultDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchUsersQueryDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)(':username'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.PublicProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':username/journal'),
    (0, swagger_1.ApiOperation)({ summary: "Get user's public journal entries" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of journal entries',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.PublicJournalQueryDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getPublicJournal", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map