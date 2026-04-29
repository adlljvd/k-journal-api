/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from 'class-validator';
import { ValidationExceptionFilter } from './validation-exception.filter';
import { ErrorCode } from '../enums/error-code.enum';

interface IExceptionResponse {
  success: boolean;
  statusCode: number;
  data: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
  timestamp: string;
}

interface IValidationError {
  property: string;
  value?: unknown;
  constraints?: Record<string, string>;
  children?: ValidationError[];
}

describe('ValidationExceptionFilter', () => {
  let filter: ValidationExceptionFilter;
  let mockResponse: Partial<FastifyReply>;
  let mockRequest: Partial<FastifyRequest>;
  let mockHost: ArgumentsHost;

  const createMockHost = (
    request: Partial<FastifyRequest>,
    response: Partial<FastifyReply>,
  ): ArgumentsHost => {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as ArgumentsHost;
  };

  const createValidationError = (
    property: string,
    constraints: Record<string, string>,
    value?: unknown,
    children?: ValidationError[],
  ): ValidationError => {
    const error = new ValidationError();
    error.property = property;
    error.constraints = constraints;
    if (value !== undefined) {
      error.value = value;
    }
    if (children) {
      error.children = children;
    }
    return error;
  };

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      headers: {},
      url: '/test',
      method: 'POST',
    };

    mockHost = createMockHost(mockRequest, mockResponse);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationExceptionFilter],
    }).compile();

    filter = module.get<ValidationExceptionFilter>(ValidationExceptionFilter);

    // Spy on logger
    jest.spyOn(filter['logger'], 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException with string message', () => {
      // When HttpException is created with a string message, getResponse() returns the string
      // The filter only extracts message from object responses, so it uses default message
      const exception = new HttpException(
        'Bad request',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.success).toBe(false);
      expect(sendArg.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(sendArg.requestId).toBe('unknown');
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should handle HttpException with object response containing code', () => {
      const exception = new HttpException(
        {
          message: 'Custom validation error',
          code: 'CUSTOM_VALIDATION_CODE',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe('CUSTOM_VALIDATION_CODE');
      expect(sendArg.data.message).toBe('Custom validation error');
    });

    it('should handle HttpException with array of string messages', () => {
      const exception = new HttpException(
        {
          message: ['Error 1', 'Error 2'],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Error 1, Error 2');
    });

    it('should handle HttpException with ValidationError array', () => {
      const validationErrors = [
        createValidationError('email', {
          isEmail: 'email must be a valid email',
        }),
        createValidationError('password', {
          minLength: 'password must be at least 8 characters',
        }),
      ];

      const exception = new HttpException(
        {
          message: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Validation failed');
      const details = sendArg.data.details as IValidationError[];
      expect(details).toHaveLength(2);
      expect(details[0].property).toBe('email');
      expect(details[1].property).toBe('password');
    });

    it('should handle ValidationError with value', () => {
      const validationErrors = [
        createValidationError(
          'email',
          { isEmail: 'email must be a valid email' },
          'invalid-email',
        ),
      ];

      const exception = new HttpException(
        {
          message: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      const details = sendArg.data.details as IValidationError[];
      expect(details[0].property).toBe('email');
      expect(details[0].value).toBe('invalid-email');
    });

    it('should handle nested ValidationError children', () => {
      // Parent has empty constraints object (truthy), so it's included in results
      // Children are also processed recursively
      const childError = createValidationError('street', {
        isNotEmpty: 'street should not be empty',
      });
      const parentError = createValidationError('address', {}, undefined, [
        childError,
      ]);

      const exception = new HttpException(
        {
          message: [parentError],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      const details = sendArg.data.details as IValidationError[];
      expect(details.some((d) => d.property === 'address')).toBe(true);
      expect(details.some((d) => d.property === 'street')).toBe(true);
    });

    it('should handle ValidationError without constraints', () => {
      const validationErrors = [createValidationError('field', {})];
      delete validationErrors[0].constraints;

      const exception = new HttpException(
        {
          message: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      // When no validation errors have constraints, details is undefined
      expect(sendArg.data.details).toBeUndefined();
    });

    it('should not include details when validationErrors is empty', () => {
      const exception = new HttpException(
        {
          message: [],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Validation failed');
      expect(sendArg.data.details).toBeUndefined();
    });

    it('should handle HttpException with null exception response', () => {
      const exception = new HttpException(
        null as never,
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should handle HttpException with string exception response', () => {
      const exception = new HttpException(
        'Simple string error',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should handle object response with non-string, non-array message', () => {
      const exception = new HttpException(
        {
          message: { nested: 'object' },
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should handle object response with message as number', () => {
      const exception = new HttpException(
        {
          message: 12345,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should use x-request-id header when present', () => {
      mockRequest.headers = { 'x-request-id': 'custom-request-id' };
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.requestId).toBe('custom-request-id');
    });

    it('should use "unknown" as requestId when x-request-id header is missing', () => {
      mockRequest.headers = {};
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.requestId).toBe('unknown');
    });

    it('should log the error with correct details', () => {
      const exception = new HttpException(
        { message: 'Test error', code: 'TEST_CODE' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(filter['logger'].warn).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'TEST_CODE',
        validationErrors: 0,
        path: '/test',
        requestId: 'unknown',
      });
    });

    it('should log validation errors count', () => {
      const validationErrors = [
        createValidationError('email', {
          isEmail: 'email must be a valid email',
        }),
        createValidationError('password', {
          minLength: 'password must be at least 8 characters',
        }),
      ];

      const exception = new HttpException(
        {
          message: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const warnCall = (filter['logger'].warn as jest.Mock).mock.calls[0][0];
      expect(warnCall.validationErrors).toBe(2);
    });

    it('should include timestamp in response', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(typeof sendArg.timestamp).toBe('string');
    });

    it('should handle object response with message array of non-string items', () => {
      const exception = new HttpException(
        {
          message: [123, 456],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should handle empty message array as ValidationError array', () => {
      const exception = new HttpException(
        {
          message: [],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Validation failed');
    });

    it('should handle deeply nested ValidationError children', () => {
      // All parents with constraints (even empty) are included, plus children are flattened
      const deepChild = createValidationError('city', {
        isNotEmpty: 'city should not be empty',
      });
      const childError = createValidationError('address', {}, undefined, [
        deepChild,
      ]);
      const parentError = createValidationError('user', {}, undefined, [
        childError,
      ]);

      const exception = new HttpException(
        {
          message: [parentError],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      const details = sendArg.data.details as IValidationError[];
      expect(details.some((d) => d.property === 'user')).toBe(true);
      expect(details.some((d) => d.property === 'address')).toBe(true);
      expect(details.some((d) => d.property === 'city')).toBe(true);
    });

    it('should handle ValidationError with empty children array', () => {
      const validationErrors = [
        createValidationError('field', { isNotEmpty: 'field required' }),
      ];
      validationErrors[0].children = [];

      const exception = new HttpException(
        {
          message: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      const details = sendArg.data.details as IValidationError[];
      expect(details).toHaveLength(1);
      expect(details[0].property).toBe('field');
    });

    it('should handle mixed ValidationError array with some having constraints and some not', () => {
      const errorWithConstraints = createValidationError('email', {
        isEmail: 'email must be valid',
      });
      const errorWithoutConstraints = createValidationError('address', {});
      delete errorWithoutConstraints.constraints;

      const exception = new HttpException(
        {
          message: [errorWithConstraints, errorWithoutConstraints],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      const details = sendArg.data.details as IValidationError[];
      expect(details).toHaveLength(1);
      expect(details[0].property).toBe('email');
    });
  });

  describe('flattenValidationErrors', () => {
    it('should flatten nested validation errors correctly', () => {
      const child1 = createValidationError('street', {
        isNotEmpty: 'street required',
      });
      const child2 = createValidationError('city', {
        isNotEmpty: 'city required',
      });
      const parent = createValidationError('address', {}, undefined, [
        child1,
        child2,
      ]);

      const exception = new HttpException(
        {
          message: [parent],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      const details = sendArg.data.details as IValidationError[];
      expect(details.some((d) => d.property === 'street')).toBe(true);
      expect(details.some((d) => d.property === 'city')).toBe(true);
    });
  });
});
