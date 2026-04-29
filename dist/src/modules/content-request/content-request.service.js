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
exports.ContentRequestService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../common/services/base.service");
const content_request_repository_1 = require("./content-request.repository");
const entities_1 = require("./entities");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
const error_code_enum_1 = require("../../common/enums/error-code.enum");
const DAILY_REQUEST_LIMIT = 5;
let ContentRequestService = class ContentRequestService extends base_service_1.BaseService {
    contentRequestRepository;
    constructor(contentRequestRepository) {
        super();
        this.contentRequestRepository = contentRequestRepository;
    }
    async createRequest(userId, dto) {
        const dailyCount = await this.contentRequestRepository.countByUserToday(userId);
        if (dailyCount >= DAILY_REQUEST_LIMIT) {
            return this.error(error_code_enum_1.ErrorCode.RATE_LIMIT_EXCEEDED, `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} content requests.`);
        }
        const existingRequest = await this.contentRequestRepository.findByUserAndTitle(userId, dto.title);
        if (existingRequest) {
            return this.error(error_code_enum_1.ErrorCode.DUPLICATE_REQUEST, 'You have already submitted a request for this title.');
        }
        const request = await this.contentRequestRepository.create({
            title: dto.title,
            type: dto.type,
            year: dto.year,
            notes: dto.notes,
            user: {
                connect: { id: userId },
            },
        });
        return this.success((0, entities_1.toContentRequestEntity)(request));
    }
    async getMyRequests(userId, query) {
        const result = await this.contentRequestRepository.findByUserId(userId, {
            page: query.page,
            limit: query.limit,
            status: query.status,
        });
        const entities = result.items.map(entities_1.toContentRequestEntity);
        return this.success(new paginated_response_dto_1.PaginatedResponseDto(entities, result.meta.total, result.meta.page, result.meta.limit));
    }
    async checkDailyLimit(userId) {
        const count = await this.contentRequestRepository.countByUserToday(userId);
        const remaining = Math.max(0, DAILY_REQUEST_LIMIT - count);
        return this.success({ remaining });
    }
};
exports.ContentRequestService = ContentRequestService;
exports.ContentRequestService = ContentRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_request_repository_1.ContentRequestRepository])
], ContentRequestService);
//# sourceMappingURL=content-request.service.js.map