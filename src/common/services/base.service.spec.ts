import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseService, Result, ErrorResult } from './base.service';
import { ErrorCode } from '../enums/error-code.enum';

// Concrete implementation for testing
class TestService extends BaseService {
  getSuccessResult(): Result<string> {
    return this.success('test data');
  }

  getErrorResult(): Result<string> {
    return this.error(ErrorCode.USER_NOT_FOUND, 'User not found');
  }

  getNotFoundError(): Result<string> {
    return this.notFound('Resource not found');
  }

  getValidationError(): Result<string> {
    return this.validationError('Invalid input', { field: 'email' });
  }

  getConflictError(): Result<string> {
    return this.conflict(
      ErrorCode.EMAIL_ALREADY_EXISTS,
      'Email already exists',
    );
  }

  getUnauthorizedError(): Result<string> {
    return this.unauthorized('Invalid credentials');
  }

  getForbiddenError(): Result<string> {
    return this.forbidden('Access denied');
  }

  testLogInfo(message: string, context?: string): void {
    this.logInfo(message, context);
  }

  testLogWarn(message: string, context?: string): void {
    this.logWarn(message, context);
  }

  testLogDebug(message: string, context?: string): void {
    this.logDebug(message, context);
  }

  testLogError(error: Error, context?: string): void {
    this.logError(error, context);
  }

  testValidate(
    condition: boolean,
    errorCode: ErrorCode,
    message: string,
  ): ErrorResult | undefined {
    return this.validate(condition, errorCode, message);
  }

  testThrowIfErrorSync(result: Result<unknown>): void {
    this.throwIfError(result);
  }

  testWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    errorCode: ErrorCode,
  ): Promise<Result<T>> {
    return this.withErrorHandling(operation, errorMessage, errorCode);
  }
}

describe('BaseService', () => {
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestService],
    }).compile();

    service = module.get<TestService>(TestService);
  });

  describe('success', () => {
    it('should return a success result with data', () => {
      const result = service.getSuccessResult();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test data');
      }
    });
  });

  describe('error', () => {
    it('should return an error result with code and message', () => {
      const result = service.getErrorResult();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
        expect(result.error.message).toBe('User not found');
      }
    });

    it('should return an error result with details', () => {
      const result = service.getValidationError();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(result.error.message).toBe('Invalid input');
        expect(result.error.details).toEqual({ field: 'email' });
      }
    });
  });

  describe('notFound', () => {
    it('should return a not found error result', () => {
      const result = service.getNotFoundError();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.USER_NOT_FOUND);
        expect(result.error.message).toBe('Resource not found');
      }
    });
  });

  describe('validationError', () => {
    it('should return a validation error result', () => {
      const result = service.getValidationError();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
      }
    });
  });

  describe('conflict', () => {
    it('should return a conflict error result', () => {
      const result = service.getConflictError();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
        expect(result.error.message).toBe('Email already exists');
      }
    });
  });

  describe('unauthorized', () => {
    it('should return an unauthorized error result', () => {
      const result = service.getUnauthorizedError();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.AUTH_INVALID_CREDENTIALS);
        expect(result.error.message).toBe('Invalid credentials');
      }
    });
  });

  describe('forbidden', () => {
    it('should return a forbidden error result', () => {
      const result = service.getForbiddenError();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
        expect(result.error.message).toBe('Access denied');
      }
    });
  });

  describe('validate', () => {
    it('should return undefined when condition is true', () => {
      const result = service.testValidate(
        true,
        ErrorCode.VALIDATION_FAILED,
        'Error',
      );

      expect(result).toBeUndefined();
    });

    it('should return error result when condition is false', () => {
      const result = service.testValidate(
        false,
        ErrorCode.VALIDATION_FAILED,
        'Validation failed',
      );

      expect(result).toBeDefined();
      if (result) {
        expect(result.success).toBe(false);
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(result.error.message).toBe('Validation failed');
      }
    });
  });

  describe('logging methods', () => {
    it('should have a logger instance', () => {
      expect((service as unknown as { logger: unknown }).logger).toBeDefined();
    });

    it('should call logInfo without context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { log: jest.Mock } }).logger,
        'log',
      );
      service.testLogInfo('test message');
      expect(logSpy).toHaveBeenCalledWith('test message');
    });

    it('should call logInfo with context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { log: jest.Mock } }).logger,
        'log',
      );
      service.testLogInfo('test message', 'TestContext');
      expect(logSpy).toHaveBeenCalledWith('[TestContext] test message');
    });

    it('should call logWarn without context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { warn: jest.Mock } }).logger,
        'warn',
      );
      service.testLogWarn('warning message');
      expect(logSpy).toHaveBeenCalledWith('warning message');
    });

    it('should call logWarn with context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { warn: jest.Mock } }).logger,
        'warn',
      );
      service.testLogWarn('warning message', 'TestContext');
      expect(logSpy).toHaveBeenCalledWith('[TestContext] warning message');
    });

    it('should call logDebug without context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { debug: jest.Mock } }).logger,
        'debug',
      );
      service.testLogDebug('debug message');
      expect(logSpy).toHaveBeenCalledWith('debug message');
    });

    it('should call logDebug with context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { debug: jest.Mock } }).logger,
        'debug',
      );
      service.testLogDebug('debug message', 'TestContext');
      expect(logSpy).toHaveBeenCalledWith('[TestContext] debug message');
    });

    it('should call logError without context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { error: jest.Mock } }).logger,
        'error',
      );
      const error = new Error('test error');
      service.testLogError(error);
      expect(logSpy).toHaveBeenCalledWith(error.message, error.stack);
    });

    it('should call logError with context', () => {
      const logSpy = jest.spyOn(
        (service as unknown as { logger: { error: jest.Mock } }).logger,
        'error',
      );
      const error = new Error('test error');
      service.testLogError(error, 'TestContext');
      expect(logSpy).toHaveBeenCalledWith(
        `TestContext: ${error.message}`,
        error.stack,
      );
    });
  });

  describe('throwIfError', () => {
    it('should not throw for success result', () => {
      const result = Result.success('data');

      expect(() => service.testThrowIfErrorSync(result)).not.toThrow();
    });

    it('should throw NotFoundException for USER_NOT_FOUND', () => {
      const result = Result.error(ErrorCode.USER_NOT_FOUND, 'User not found');

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException for EMAIL_ALREADY_EXISTS', () => {
      const result = Result.error(
        ErrorCode.EMAIL_ALREADY_EXISTS,
        'Email already exists',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException for USERNAME_ALREADY_EXISTS', () => {
      const result = Result.error(
        ErrorCode.USERNAME_ALREADY_EXISTS,
        'Username already exists',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException for ENTRY_ALREADY_EXISTS', () => {
      const result = Result.error(
        ErrorCode.ENTRY_ALREADY_EXISTS,
        'Entry already exists',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException for DUPLICATE_REQUEST', () => {
      const result = Result.error(
        ErrorCode.DUPLICATE_REQUEST,
        'Duplicate request',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        ConflictException,
      );
    });

    it('should throw UnauthorizedException for AUTH_INVALID_CREDENTIALS', () => {
      const result = Result.error(
        ErrorCode.AUTH_INVALID_CREDENTIALS,
        'Invalid credentials',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for AUTH_TOKEN_EXPIRED', () => {
      const result = Result.error(
        ErrorCode.AUTH_TOKEN_EXPIRED,
        'Token expired',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for AUTH_TOKEN_INVALID', () => {
      const result = Result.error(
        ErrorCode.AUTH_TOKEN_INVALID,
        'Invalid token',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for INVALID_TOKEN', () => {
      const result = Result.error(ErrorCode.INVALID_TOKEN, 'Invalid token');

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for TOKEN_EXPIRED', () => {
      const result = Result.error(ErrorCode.TOKEN_EXPIRED, 'Token expired');

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for INVALID_PASSWORD', () => {
      const result = Result.error(
        ErrorCode.INVALID_PASSWORD,
        'Invalid password',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for INVALID_CURRENT_PASSWORD', () => {
      const result = Result.error(
        ErrorCode.INVALID_CURRENT_PASSWORD,
        'Invalid current password',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException for VALIDATION_FAILED', () => {
      const result = Result.error(
        ErrorCode.VALIDATION_FAILED,
        'Validation failed',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(
        BadRequestException,
      );
    });

    it('should throw HttpException with 429 status for RATE_LIMIT_EXCEEDED', () => {
      const result = Result.error(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Rate limit exceeded',
      );

      expect(() => service.testThrowIfErrorSync(result)).toThrow(HttpException);
    });
  });

  describe('withErrorHandling', () => {
    it('should return success result when operation succeeds', async () => {
      const result = await service.testWithErrorHandling(
        () => Promise.resolve('success'),
        'Error message',
        ErrorCode.VALIDATION_FAILED,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('success');
      }
    });

    it('should return error result when operation fails', async () => {
      const result = await service.testWithErrorHandling(
        async () => Promise.reject(new Error('Operation failed')),
        'Error message',
        ErrorCode.VALIDATION_FAILED,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(result.error.message).toBe('Error message');
      }
    });
  });
});
