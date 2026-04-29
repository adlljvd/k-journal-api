"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const error_response_dto_1 = require("../dto/error-response.dto");
const error_code_enum_1 = require("../enums/error-code.enum");
const PRISMA_ERROR_MAPPING = {
    P2002: { code: error_code_enum_1.ErrorCode.EMAIL_ALREADY_EXISTS, status: common_1.HttpStatus.CONFLICT },
    P2003: { code: error_code_enum_1.ErrorCode.USER_NOT_FOUND, status: common_1.HttpStatus.NOT_FOUND },
    P2005: { code: error_code_enum_1.ErrorCode.USER_NOT_FOUND, status: common_1.HttpStatus.NOT_FOUND },
    P2015: { code: error_code_enum_1.ErrorCode.USER_NOT_FOUND, status: common_1.HttpStatus.NOT_FOUND },
    P2016: { code: error_code_enum_1.ErrorCode.VALIDATION_FAILED, status: common_1.HttpStatus.BAD_REQUEST },
    P2017: { code: error_code_enum_1.ErrorCode.VALIDATION_FAILED, status: common_1.HttpStatus.BAD_REQUEST },
    P2018: { code: error_code_enum_1.ErrorCode.VALIDATION_FAILED, status: common_1.HttpStatus.BAD_REQUEST },
    P2019: { code: error_code_enum_1.ErrorCode.VALIDATION_FAILED, status: common_1.HttpStatus.BAD_REQUEST },
    P2025: { code: error_code_enum_1.ErrorCode.VALIDATION_FAILED, status: common_1.HttpStatus.BAD_REQUEST },
};
let PrismaExceptionFilter = PrismaExceptionFilter_1 = class PrismaExceptionFilter {
    logger = new common_1.Logger(PrismaExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'] || 'unknown';
        const errorCode = exception.code;
        const mapping = PRISMA_ERROR_MAPPING[errorCode];
        let errorResponse;
        if (mapping) {
            let message = 'Database constraint violation';
            const details = undefined;
            if (errorCode === 'P2002') {
                const target = exception.meta?.target || [];
                if (target.includes('email')) {
                    message = 'An account with this email already exists.';
                }
                else if (target.includes('username')) {
                    message = 'This username is already taken.';
                }
                else if (target.includes('slug')) {
                    message = 'This slug is already in use.';
                }
            }
            errorResponse = {
                success: false,
                statusCode: mapping.status,
                data: new error_response_dto_1.ErrorResponseDto(mapping.code, message, details),
                requestId,
                timestamp: new Date().toISOString(),
            };
            this.logger.warn({
                statusCode: mapping.status,
                prismaCode: errorCode,
                target: exception.meta?.target,
                path: request.url,
                requestId,
            });
        }
        else {
            errorResponse = {
                success: false,
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                data: new error_response_dto_1.ErrorResponseDto(error_code_enum_1.ErrorCode.VALIDATION_FAILED, 'An internal error occurred', undefined),
                requestId,
                timestamp: new Date().toISOString(),
            };
            this.logger.error({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                prismaCode: errorCode,
                path: request.url,
                requestId,
            });
        }
        response.status(errorResponse.statusCode).send(errorResponse);
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = PrismaExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map