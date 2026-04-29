"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const error_response_dto_1 = require("../dto/error-response.dto");
const error_code_enum_1 = require("../enums/error-code.enum");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const requestId = request.headers['x-request-id'] || 'unknown';
        let errorCode = error_code_enum_1.ErrorCode.VALIDATION_FAILED;
        let message = 'An error occurred';
        let details = undefined;
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resp = exceptionResponse;
            if (resp.code) {
                errorCode = resp.code;
            }
            if (resp.message) {
                message = Array.isArray(resp.message)
                    ? resp.message.join(', ')
                    : resp.message;
            }
            if (resp.details) {
                details = resp.details;
            }
        }
        if (status === 401) {
            if (message.toLowerCase().includes('expired')) {
                errorCode = error_code_enum_1.ErrorCode.AUTH_TOKEN_EXPIRED;
            }
            else {
                errorCode = error_code_enum_1.ErrorCode.AUTH_TOKEN_INVALID;
            }
        }
        const errorResponse = {
            success: false,
            statusCode: status,
            data: new error_response_dto_1.ErrorResponseDto(errorCode, message, details),
            requestId,
            timestamp: new Date().toISOString(),
        };
        this.logger.warn({
            statusCode: status,
            errorCode,
            path: request.url,
            method: request.method,
            requestId,
        });
        response.status(status).send(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map