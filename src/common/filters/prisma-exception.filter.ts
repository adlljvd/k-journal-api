import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Prisma } from '@prisma/client';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { ErrorCode } from '../enums/error-code.enum';

interface IExceptionResponse {
  success: boolean;
  statusCode: number;
  data: ErrorResponseDto;
  requestId: string;
  timestamp: string;
}

const PRISMA_ERROR_MAPPING: Record<
  string,
  { code: ErrorCode; status: HttpStatus }
> = {
  P2002: { code: ErrorCode.EMAIL_ALREADY_EXISTS, status: HttpStatus.CONFLICT },
  P2003: { code: ErrorCode.USER_NOT_FOUND, status: HttpStatus.NOT_FOUND },
  P2005: { code: ErrorCode.USER_NOT_FOUND, status: HttpStatus.NOT_FOUND },
  P2015: { code: ErrorCode.USER_NOT_FOUND, status: HttpStatus.NOT_FOUND },
  P2016: { code: ErrorCode.VALIDATION_FAILED, status: HttpStatus.BAD_REQUEST },
  P2017: { code: ErrorCode.VALIDATION_FAILED, status: HttpStatus.BAD_REQUEST },
  P2018: { code: ErrorCode.VALIDATION_FAILED, status: HttpStatus.BAD_REQUEST },
  P2019: { code: ErrorCode.VALIDATION_FAILED, status: HttpStatus.BAD_REQUEST },
  P2025: { code: ErrorCode.VALIDATION_FAILED, status: HttpStatus.BAD_REQUEST },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const requestId = (request.headers['x-request-id'] as string) || 'unknown';
    const errorCode = exception.code;

    const mapping = PRISMA_ERROR_MAPPING[errorCode];

    let errorResponse: IExceptionResponse;

    if (mapping) {
      let message = 'Database constraint violation';
      const details: unknown = undefined;

      if (errorCode === 'P2002') {
        const target = (exception.meta?.target as string[]) || [];
        if (target.includes('email')) {
          message = 'An account with this email already exists.';
        } else if (target.includes('username')) {
          message = 'This username is already taken.';
        } else if (target.includes('slug')) {
          message = 'This slug is already in use.';
        }
      }

      errorResponse = {
        success: false,
        statusCode: mapping.status,
        data: new ErrorResponseDto(mapping.code, message, details),
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
    } else {
      errorResponse = {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: new ErrorResponseDto(
          ErrorCode.VALIDATION_FAILED,
          'An internal error occurred',
          undefined,
        ),
        requestId,
        timestamp: new Date().toISOString(),
      };

      this.logger.error({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        prismaCode: errorCode,
        path: request.url,
        requestId,
      });
    }

    response.status(errorResponse.statusCode).send(errorResponse);
  }
}
