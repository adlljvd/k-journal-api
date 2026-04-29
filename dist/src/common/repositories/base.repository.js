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
exports.BaseRepository = exports.PRISMA_TRANSACTION = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const paginated_response_dto_1 = require("../dto/paginated-response.dto");
exports.PRISMA_TRANSACTION = 'PRISMA_TRANSACTION';
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 100;
const MAX_PAGINATION_LIMIT = 100;
const DEFAULT_PAGINATION_LIMIT = 20;
const TRANSIENT_ERROR_CODES = [
    'P1001',
    'P1002',
    'P1008',
    'P1017',
    'P1024',
];
let BaseRepository = class BaseRepository {
    prismaService;
    transactionClient;
    logger;
    constructor(prismaService, transactionClient) {
        this.prismaService = prismaService;
        this.transactionClient = transactionClient;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    getClient() {
        if (this.transactionClient) {
            return this.transactionClient;
        }
        return this.getModel();
    }
    async withRetry(operation, operationName) {
        let lastError;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                const prismaError = error;
                if (prismaError.code &&
                    TRANSIENT_ERROR_CODES.includes(prismaError.code)) {
                    const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
                    this.logger.warn(`${operationName} failed with transient error (attempt ${attempt}/${MAX_RETRIES}). ` +
                        `Retrying in ${delay}ms...`);
                    if (attempt < MAX_RETRIES) {
                        await this.sleep(delay);
                        continue;
                    }
                }
                throw error instanceof Error ? error : new Error(String(error));
            }
        }
        throw lastError ?? new Error('Unknown error occurred');
    }
    async create(data) {
        return this.withRetry(async () => {
            const client = this.getClient();
            return client.create({ data });
        }, 'create');
    }
    async findById(where) {
        const client = this.getClient();
        return client.findUnique({ where });
    }
    async findPaginated(options) {
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(Math.max(1, options.limit ?? DEFAULT_PAGINATION_LIMIT), MAX_PAGINATION_LIMIT);
        const skip = options.skip ?? (page - 1) * limit;
        const client = this.getClient();
        const [items, total] = await Promise.all([
            client.findMany({
                where: options.where,
                skip,
                take: limit,
                orderBy: options.orderBy,
            }),
            client.count({
                where: options.where,
            }),
        ]);
        return new paginated_response_dto_1.PaginatedResponseDto(items, total, page, limit);
    }
    async update(where, data) {
        return this.withRetry(async () => {
            const client = this.getClient();
            return client.update({ where, data });
        }, 'update');
    }
    async delete(where) {
        return this.withRetry(async () => {
            const client = this.getClient();
            return client.delete({ where });
        }, 'delete');
    }
    async findMany(where, options) {
        const client = this.getClient();
        return client.findMany({
            where,
            orderBy: options?.orderBy,
            skip: options?.skip,
            take: options?.take,
        });
    }
    async count(where) {
        const client = this.getClient();
        return client.count({ where });
    }
    async exists(where) {
        const count = await this.count(where);
        return count > 0;
    }
    async transaction(fn) {
        return this.prismaService.$transaction(fn);
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(exports.PRISMA_TRANSACTION)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], BaseRepository);
//# sourceMappingURL=base.repository.js.map