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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const content_repository_1 = require("../content/content.repository");
const content_request_repository_1 = require("../content-request/content-request.repository");
const admin_dashboard_entity_1 = require("./entities/admin-dashboard.entity");
const content_request_entity_1 = require("../content-request/entities/content-request.entity");
let AdminService = class AdminService {
    contentRepository;
    contentRequestRepository;
    constructor(contentRepository, contentRequestRepository) {
        this.contentRepository = contentRepository;
        this.contentRequestRepository = contentRequestRepository;
    }
    async getDashboard() {
        const [pendingRequestsCount, totalContentCount, recentRequests] = await Promise.all([
            this.contentRequestRepository.countPending(),
            this.contentRepository.count({}),
            this.contentRequestRepository.findRecent(5),
        ]);
        return new admin_dashboard_entity_1.AdminDashboardEntity({
            pendingRequestsCount,
            totalContentCount,
            recentRequests: recentRequests.map((req) => new content_request_entity_1.ContentRequestEntity({
                ...req,
                type: req.type,
                status: req.status,
            })),
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository,
        content_request_repository_1.ContentRequestRepository])
], AdminService);
//# sourceMappingURL=admin.service.js.map