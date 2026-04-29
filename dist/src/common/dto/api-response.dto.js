"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseDto = void 0;
class ApiResponseDto {
    success;
    statusCode;
    data;
    requestId;
    timestamp;
    constructor(data, statusCode, requestId, success = true) {
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.requestId = requestId;
        this.timestamp = new Date().toISOString();
    }
}
exports.ApiResponseDto = ApiResponseDto;
//# sourceMappingURL=api-response.dto.js.map