/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ArgumentsHost } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Prisma } from '@prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';
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

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
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

  const createPrismaError = (
    code: string,
    meta?: Record<string, unknown>,
  ): Prisma.PrismaClientKnownRequestError => {
    return new Prisma.PrismaClientKnownRequestError('Database error', {
      code,
      clientVersion: '5.0.0',
      meta,
    });
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
      providers: [PrismaExceptionFilter],
    }).compile();

    filter = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);

    // Spy on loggers
    jest.spyOn(filter['logger'], 'warn').mockImplementation(() => {});
    jest.spyOn(filter['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    describe('P2002 - Unique constraint violation', () => {
      it('should handle P2002 error with email target', () => {
        const exception = createPrismaError('P2002', { target: ['email'] });

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.success).toBe(false);
        expect(sendArg.statusCode).toBe(HttpStatus.CONFLICT);
        expect(sendArg.data.code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
        expect(sendArg.data.message).toBe(
          'An account with this email already exists.',
        );
      });

      it('should handle P2002 error with username target', () => {
        const exception = createPrismaError('P2002', { target: ['username'] });

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
        expect(sendArg.data.message).toBe('This username is already taken.');
      });

      it('should handle P2002 error with slug target', () => {
        const exception = createPrismaError('P2002', { target: ['slug'] });

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
        expect(sendArg.data.message).toBe('This slug is already in use.');
      });

      it('should handle P2002 error with unknown target', () => {
        const exception = createPrismaError('P2002', {
          target: ['other_field'],
        });

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
        expect(sendArg.data.message).toBe('Database constraint violation');
      });

      it('should handle P2002 error without meta', () => {
        const exception = createPrismaError('P2002');

        filter.catch(exception, mockHost);

        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.message).toBe('Database constraint violation');
      });
    });

    describe('P2003 - Foreign key constraint violation', () => {
      it('should handle P2003 error', () => {
        const exception = createPrismaError('P2003');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.USER_NOT_FOUND);
      });
    });

    describe('P2005 - Invalid data type', () => {
      it('should handle P2005 error', () => {
        const exception = createPrismaError('P2005');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.USER_NOT_FOUND);
      });
    });

    describe('P2015 - Record not found', () => {
      it('should handle P2015 error', () => {
        const exception = createPrismaError('P2015');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.USER_NOT_FOUND);
      });
    });

    describe('P2016 - Query interpretation error', () => {
      it('should handle P2016 error', () => {
        const exception = createPrismaError('P2016');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST,
        );
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      });
    });

    describe('P2017 - Query interpretation error', () => {
      it('should handle P2017 error', () => {
        const exception = createPrismaError('P2017');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST,
        );
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      });
    });

    describe('P2018 - Record not found', () => {
      it('should handle P2018 error', () => {
        const exception = createPrismaError('P2018');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST,
        );
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      });
    });

    describe('P2019 - Input error', () => {
      it('should handle P2019 error', () => {
        const exception = createPrismaError('P2019');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST,
        );
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      });
    });

    describe('P2025 - Record not found', () => {
      it('should handle P2025 error', () => {
        const exception = createPrismaError('P2025');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST,
        );
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
      });
    });

    describe('Unknown Prisma error', () => {
      it('should handle unknown Prisma error code', () => {
        const exception = createPrismaError('P9999');

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        const sendArg = (mockResponse.send as jest.Mock).mock
          .calls[0][0] as IExceptionResponse;
        expect(sendArg.success).toBe(false);
        expect(sendArg.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(sendArg.data.code).toBe(ErrorCode.VALIDATION_FAILED);
        expect(sendArg.data.message).toBe('An internal error occurred');
      });

      it('should log error for unknown Prisma error code', () => {
        const exception = createPrismaError('P9999');

        filter.catch(exception, mockHost);

        expect(filter['logger'].error).toHaveBeenCalledWith({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          prismaCode: 'P9999',
          path: '/test',
          requestId: 'unknown',
        });
      });
    });

    it('should use x-request-id header when present', () => {
      mockRequest.headers = { 'x-request-id': 'custom-request-id' };
      const exception = createPrismaError('P2002', { target: ['email'] });

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.requestId).toBe('custom-request-id');
    });

    it('should use "unknown" as requestId when x-request-id header is missing', () => {
      mockRequest.headers = {};
      const exception = createPrismaError('P2002', { target: ['email'] });

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.requestId).toBe('unknown');
    });

    it('should log warning for mapped Prisma errors', () => {
      const exception = createPrismaError('P2002', { target: ['email'] });

      filter.catch(exception, mockHost);

      expect(filter['logger'].warn).toHaveBeenCalledWith({
        statusCode: HttpStatus.CONFLICT,
        prismaCode: 'P2002',
        target: ['email'],
        path: '/test',
        requestId: 'unknown',
      });
    });

    it('should include timestamp in response', () => {
      const exception = createPrismaError('P2002');

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(typeof sendArg.timestamp).toBe('string');
    });

    it('should handle missing meta.target for P2002', () => {
      const exception = createPrismaError('P2002', {});

      filter.catch(exception, mockHost);

      const sendArg = (mockResponse.send as jest.Mock).mock
        .calls[0][0] as IExceptionResponse;
      expect(sendArg.data.message).toBe('Database constraint violation');
    });
  });
});
