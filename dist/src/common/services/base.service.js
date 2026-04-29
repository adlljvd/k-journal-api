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
exports.BaseService = exports.Result = void 0;
const common_1 = require("@nestjs/common");
const error_code_enum_1 = require("../enums/error-code.enum");
exports.Result = {
    success(data) {
        return { success: true, data };
    },
    error(code, message, details) {
        return { success: false, error: { code, message, details } };
    },
};
let BaseService = class BaseService {
    logger;
    constructor() {
        this.logger = new common_1.Logger(this.constructor.name);
    }
    success(data) {
        return exports.Result.success(data);
    }
    error(code, message, details) {
        return exports.Result.error(code, message, details);
    }
    notFound(message, code = error_code_enum_1.ErrorCode.USER_NOT_FOUND) {
        return this.error(code, message);
    }
    validationError(message, details) {
        return this.error(error_code_enum_1.ErrorCode.VALIDATION_FAILED, message, details);
    }
    conflict(code, message) {
        return this.error(code, message);
    }
    unauthorized(message = 'Invalid credentials') {
        return this.error(error_code_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS, message);
    }
    forbidden(message = 'Access denied') {
        return this.error(error_code_enum_1.ErrorCode.AUTH_TOKEN_INVALID, message);
    }
    logError(error, context) {
        const message = context ? `${context}: ${error.message}` : error.message;
        this.logger.error(message, error.stack);
    }
    logInfo(message, context) {
        const logMessage = context ? `[${context}] ${message}` : message;
        this.logger.log(logMessage);
    }
    logWarn(message, context) {
        const logMessage = context ? `[${context}] ${message}` : message;
        this.logger.warn(logMessage);
    }
    logDebug(message, context) {
        const logMessage = context ? `[${context}] ${message}` : message;
        this.logger.debug(logMessage);
    }
    throwIfError(result) {
        if (result.success) {
            return;
        }
        const { code, message } = result.error;
        switch (code) {
            case error_code_enum_1.ErrorCode.USER_NOT_FOUND:
                throw new common_1.NotFoundException({ message, code });
            case error_code_enum_1.ErrorCode.EMAIL_ALREADY_EXISTS:
            case error_code_enum_1.ErrorCode.USERNAME_ALREADY_EXISTS:
            case error_code_enum_1.ErrorCode.ENTRY_ALREADY_EXISTS:
            case error_code_enum_1.ErrorCode.DUPLICATE_REQUEST:
                throw new common_1.ConflictException({ message, code });
            case error_code_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS:
            case error_code_enum_1.ErrorCode.AUTH_TOKEN_EXPIRED:
            case error_code_enum_1.ErrorCode.AUTH_TOKEN_INVALID:
            case error_code_enum_1.ErrorCode.INVALID_TOKEN:
            case error_code_enum_1.ErrorCode.TOKEN_EXPIRED:
            case error_code_enum_1.ErrorCode.INVALID_PASSWORD:
            case error_code_enum_1.ErrorCode.INVALID_CURRENT_PASSWORD:
                throw new common_1.UnauthorizedException({ message, code });
            case error_code_enum_1.ErrorCode.VALIDATION_FAILED:
                throw new common_1.BadRequestException({ message, code });
            case error_code_enum_1.ErrorCode.RATE_LIMIT_EXCEEDED:
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                    message,
                    error: 'Too Many Requests',
                    code: error_code_enum_1.ErrorCode.RATE_LIMIT_EXCEEDED,
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            default:
                throw new common_1.InternalServerErrorException({ message, code });
        }
    }
    async withErrorHandling(operation, errorMessage, errorCode = error_code_enum_1.ErrorCode.VALIDATION_FAILED) {
        try {
            const result = await operation();
            return this.success(result);
        }
        catch (error) {
            this.logError(error, errorMessage);
            if (error.success === false) {
                return error;
            }
            return this.error(errorCode, errorMessage);
        }
    }
    validate(condition, errorCode, message) {
        if (!condition) {
            return this.error(errorCode, message);
        }
        return undefined;
    }
};
exports.BaseService = BaseService;
exports.BaseService = BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BaseService);
//# sourceMappingURL=base.service.js.map