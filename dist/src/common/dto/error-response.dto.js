"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseDto = void 0;
class ErrorResponseDto {
    code;
    message;
    details;
    constructor(code, message, details) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}
exports.ErrorResponseDto = ErrorResponseDto;
//# sourceMappingURL=error-response.dto.js.map