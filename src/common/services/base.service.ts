import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorCode } from '../enums/error-code.enum';

/**
 * Result type for discriminating between success and error states.
 * Use this for all public service method return types.
 *
 * @typeParam T - The type of the success data
 *
 * @example
 * ```typescript
 * const result = await service.getUser(id);
 * if (result.success) {
 *   console.log(result.data); // User data
 * } else {
 *   console.log(result.error); // Error details
 * }
 * ```
 */
export type Result<T> = SuccessResult<T> | ErrorResult;

/**
 * Success result type
 */
export interface SuccessResult<T> {
  success: true;
  data: T;
}

/**
 * Error result type
 */
export interface ErrorResult {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Factory functions for creating Result instances
 */
export const Result = {
  /**
   * Creates a successful result
   */
  success<T>(data: T): SuccessResult<T> {
    return { success: true, data };
  },

  /**
   * Creates an error result
   */
  error(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ): ErrorResult {
    return { success: false, error: { code, message, details } };
  },
};

/**
 * Base service providing common service-level operations and error handling patterns.
 * All domain services should extend this base class.
 *
 * @example
 * ```typescript
 * class UserService extends BaseService {
 *   constructor(protected readonly repository: UserRepository) {
 *     super();
 *   }
 *
 *   async getUser(id: string): Promise<Result<User>> {
 *     const user = await this.repository.findById({ id });
 *     if (!user) {
 *       return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
 *     }
 *     return this.success(user);
 *   }
 * }
 * ```
 */
@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Creates a successful result with the given data.
   *
   * @param data - The success data
   * @returns A SuccessResult
   */
  protected success<T>(data: T): SuccessResult<T> {
    return Result.success(data);
  }

  /**
   * Creates an error result with the given code and message.
   *
   * @param code - Error code from ErrorCode enum
   * @param message - Human-readable error message
   * @param details - Optional additional error details
   * @returns An ErrorResult
   */
  protected error(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ): ErrorResult {
    return Result.error(code, message, details);
  }

  /**
   * Creates a "not found" error result.
   * Convenience method for common error pattern.
   *
   * @param message - Error message
   * @param code - Error code (defaults to USER_NOT_FOUND)
   * @returns An ErrorResult
   */
  protected notFound(
    message: string,
    code: ErrorCode = ErrorCode.USER_NOT_FOUND,
  ): ErrorResult {
    return this.error(code, message);
  }

  /**
   * Creates a validation error result.
   *
   * @param message - Error message
   * @param details - Validation error details (e.g., field errors)
   * @returns An ErrorResult
   */
  protected validationError(
    message: string,
    details?: Record<string, unknown>,
  ): ErrorResult {
    return this.error(ErrorCode.VALIDATION_FAILED, message, details);
  }

  /**
   * Creates a conflict error result.
   * Use for duplicate resource errors.
   *
   * @param code - Specific conflict error code
   * @param message - Error message
   * @returns An ErrorResult
   */
  protected conflict(code: ErrorCode, message: string): ErrorResult {
    return this.error(code, message);
  }

  /**
   * Creates an unauthorized error result.
   *
   * @param message - Error message
   * @returns An ErrorResult
   */
  protected unauthorized(message: string = 'Invalid credentials'): ErrorResult {
    return this.error(ErrorCode.AUTH_INVALID_CREDENTIALS, message);
  }

  /**
   * Creates a forbidden error result.
   *
   * @param message - Error message
   * @returns An ErrorResult
   */
  protected forbidden(message: string = 'Access denied'): ErrorResult {
    return this.error(ErrorCode.AUTH_TOKEN_INVALID, message);
  }

  /**
   * Logs an error with context information.
   *
   * @param error - The error object
   * @param context - Additional context for the error
   */
  protected logError(error: Error, context?: string): void {
    const message = context ? `${context}: ${error.message}` : error.message;
    this.logger.error(message, error.stack);
  }

  /**
   * Logs an info message.
   *
   * @param message - The message to log
   * @param context - Optional context
   */
  protected logInfo(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.log(logMessage);
  }

  /**
   * Logs a warning message.
   *
   * @param message - The message to log
   * @param context - Optional context
   */
  protected logWarn(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.warn(logMessage);
  }

  /**
   * Logs a debug message.
   *
   * @param message - The message to log
   * @param context - Optional context
   */
  protected logDebug(message: string, context?: string): void {
    const logMessage = context ? `[${context}] ${message}` : message;
    this.logger.debug(logMessage);
  }

  /**
   * Converts a Result to an HTTP exception if it's an error.
   * Useful in controllers to throw appropriate HTTP exceptions.
   *
   * @param result - The result to check
   * @throws The appropriate HTTP exception if result is an error
   */
  protected throwIfError(result: Result<unknown>): void {
    if (result.success) {
      return;
    }

    const { code, message } = result.error;

    switch (code) {
      case ErrorCode.USER_NOT_FOUND:
        throw new NotFoundException({ message, code });
      case ErrorCode.EMAIL_ALREADY_EXISTS:
      case ErrorCode.USERNAME_ALREADY_EXISTS:
      case ErrorCode.ENTRY_ALREADY_EXISTS:
      case ErrorCode.DUPLICATE_REQUEST:
        throw new ConflictException({ message, code });
      case ErrorCode.AUTH_INVALID_CREDENTIALS:
      case ErrorCode.AUTH_TOKEN_EXPIRED:
      case ErrorCode.AUTH_TOKEN_INVALID:
      case ErrorCode.INVALID_TOKEN:
      case ErrorCode.TOKEN_EXPIRED:
      case ErrorCode.INVALID_PASSWORD:
      case ErrorCode.INVALID_CURRENT_PASSWORD:
        throw new UnauthorizedException({ message, code });
      case ErrorCode.VALIDATION_FAILED:
        throw new BadRequestException({ message, code });
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message,
            error: 'Too Many Requests',
            code: ErrorCode.RATE_LIMIT_EXCEEDED,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      default:
        throw new InternalServerErrorException({ message, code });
    }
  }

  /**
   * Wraps an operation with error handling.
   * Logs errors and returns a Result type.
   *
   * @param operation - The async operation to execute
   * @param errorMessage - Error message if operation fails
   * @param errorCode - Error code if operation fails
   * @returns A Result with the operation result or error
   */
  protected async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    errorCode: ErrorCode = ErrorCode.VALIDATION_FAILED,
  ): Promise<Result<T>> {
    try {
      const result = await operation();
      return this.success(result);
    } catch (error) {
      this.logError(error as Error, errorMessage);
      if ((error as ErrorResult).success === false) {
        return error as ErrorResult;
      }
      return this.error(errorCode, errorMessage);
    }
  }

  /**
   * Validates that a condition is true, otherwise returns an error result.
   *
   * @param condition - The condition to validate
   * @param errorCode - Error code if condition is false
   * @param message - Error message if condition is false
   * @returns undefined if valid, ErrorResult if invalid
   */
  protected validate(
    condition: boolean,
    errorCode: ErrorCode,
    message: string,
  ): ErrorResult | undefined {
    if (!condition) {
      return this.error(errorCode, message);
    }
    return undefined;
  }
}
