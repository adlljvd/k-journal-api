/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ErrorCode } from '../enums/error-code.enum';
import { FastifyRequest, FastifyReply } from 'fastify';

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

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
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

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      headers: {},
      url: '/test',
      method: 'GET',
    };

    mockHost = createMockHost(mockRequest, mockResponse);

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

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
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.success).toBe(false);
      expect(sendArg.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(sendArg.requestId).toBe('unknown');
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('An error occurred');
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        {
          message: 'Custom error message',
          code: 'CUSTOM_ERROR',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe('CUSTOM_ERROR');
      expect(sendArg.data.message).toBe('Custom error message');
    });

    it('should handle HttpException with array of messages', () => {
      const exception = new HttpException(
        {
          message: ['Error 1', 'Error 2', 'Error 3'],
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Error 1, Error 2, Error 3');
    });

    it('should handle HttpException with details in response', () => {
      const exception = new HttpException(
        {
          message: 'Validation failed',
          code: ErrorCode.VALIDATION_FAILED,
          details: { field: 'email', constraint: 'isEmail' },
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.details).toEqual({
        field: 'email',
        constraint: 'isEmail',
      });
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

    describe('401 status code handling', () => {
      it('should set AUTH_TOKEN_EXPIRED for expired token messages', () => {
        const exception = new HttpException(
          { message: 'Token has expired' },
          HttpStatus.UNAUTHORIZED,
        );

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.AUTH_TOKEN_EXPIRED);
      });

      it('should set AUTH_TOKEN_EXPIRED for expired token (case insensitive)', () => {
        const exception = new HttpException(
          { message: 'YOUR TOKEN HAS EXPIRED' },
          HttpStatus.UNAUTHORIZED,
        );

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.AUTH_TOKEN_EXPIRED);
      });

      it('should set AUTH_TOKEN_INVALID for non-expired 401 errors', () => {
        const exception = new HttpException(
          { message: 'Invalid token' },
          HttpStatus.UNAUTHORIZED,
        );

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
      });
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
        path: '/test',
        method: 'GET',
        requestId: 'unknown',
      });
    });

    it('should include timestamp in response', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(typeof sendArg.timestamp).toBe('string');
    });

    it('should handle null exception response', () => {
      const exception = new HttpException(
        null as never,
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('An error occurred');
    });

    it('should handle string exception response', () => {
      const exception = new HttpException(
        'Simple string error',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('An error occurred');
    });

    it('should handle object response without code', () => {
      const exception = new HttpException(
        { message: 'Error without code' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      expect(sendArg.data.message).toBe('Error without code');
    });

    it('should handle object response without message', () => {
      const exception = new HttpException(
        { code: 'SOME_CODE' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe('SOME_CODE');
      expect(sendArg.data.message).toBe('An error occurred');
    });

    it('should use default values for 401 status without message', () => {
      const exception = new HttpException({}, HttpStatus.UNAUTHORIZED);

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
      expect(sendArg.data.message).toBe('An error occurred');
    });
  });
});
