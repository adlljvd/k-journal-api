import { Logger } from '@nestjs/common';
import { ErrorCode } from '../enums/error-code.enum';
export type Result<T> = SuccessResult<T> | ErrorResult;
export interface SuccessResult<T> {
    success: true;
    data: T;
}
export interface ErrorResult {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
        details?: Record<string, unknown>;
    };
}
export declare const Result: {
    success<T>(data: T): SuccessResult<T>;
    error(code: ErrorCode, message: string, details?: Record<string, unknown>): ErrorResult;
};
export declare abstract class BaseService {
    protected readonly logger: Logger;
    constructor();
    protected success<T>(data: T): SuccessResult<T>;
    protected error(code: ErrorCode, message: string, details?: Record<string, unknown>): ErrorResult;
    protected notFound(message: string, code?: ErrorCode): ErrorResult;
    protected validationError(message: string, details?: Record<string, unknown>): ErrorResult;
    protected conflict(code: ErrorCode, message: string): ErrorResult;
    protected unauthorized(message?: string): ErrorResult;
    protected forbidden(message?: string): ErrorResult;
    protected logError(error: Error, context?: string): void;
    protected logInfo(message: string, context?: string): void;
    protected logWarn(message: string, context?: string): void;
    protected logDebug(message: string, context?: string): void;
    protected throwIfError(result: Result<unknown>): void;
    protected withErrorHandling<T>(operation: () => Promise<T>, errorMessage: string, errorCode?: ErrorCode): Promise<Result<T>>;
    protected validate(condition: boolean, errorCode: ErrorCode, message: string): ErrorResult | undefined;
}
