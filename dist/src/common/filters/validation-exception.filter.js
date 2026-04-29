"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ValidationExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const error_response_dto_1 = require("../dto/error-response.dto");
const error_code_enum_1 = require("../enums/error-code.enum");
function flattenValidationErrors(errors) {
    const result = [];
    for (const error of errors) {
        if (error.constraints) {
            result.push({
                property: error.property,
                value: error.value,
                constraints: error.constraints,
            });
        }
        if (error.children && error.children.length > 0) {
            result.push(...flattenValidationErrors(error.children));
        }
    }
    return result;
}
let ValidationExceptionFilter = ValidationExceptionFilter_1 = class ValidationExceptionFilter {
    logger = new common_1.Logger(ValidationExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'] || 'unknown';
        const exceptionResponse = exception.getResponse();
        const status = exception.getStatus();
        let validationErrors = [];
        let errorCode = error_code_enum_1.ErrorCode.VALIDATION_FAILED;
        let message = 'Validation failed';
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resp = exceptionResponse;
            if (resp.code) {
                errorCode = resp.code;
            }
            if (Array.isArray(resp.message)) {
                if (typeof resp.message[0] === 'string') {
                    message = resp.message.join(', ');
                }
                else {
                    const errors = resp.message;
                    validationErrors = flattenValidationErrors(errors);
                    message = 'Validation failed';
                }
            }
            else if (resp.message && typeof resp.message === 'string') {
                message = resp.message;
            }
        }
        const errorDetails = validationErrors.length > 0 ? validationErrors : undefined;
        const errorResponse = {
            success: false,
            statusCode: status,
            data: new error_response_dto_1.ErrorResponseDto(errorCode, message, errorDetails),
            requestId,
            timestamp: new Date().toISOString(),
        };
        this.logger.warn({
            statusCode: status,
            errorCode,
            validationErrors: validationErrors.length,
            path: request.url,
            requestId,
        });
        response.status(status).send(errorResponse);
    }
};
exports.ValidationExceptionFilter = ValidationExceptionFilter;
exports.ValidationExceptionFilter = ValidationExceptionFilter = ValidationExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], ValidationExceptionFilter);
//# sourceMappingURL=validation-exception.filter.js.map