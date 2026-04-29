import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { ErrorCode } from '../enums/error-code.enum';

interface IExceptionResponse {
  success: boolean;
  statusCode: number;
  data: ErrorResponseDto;
  requestId: string;
  timestamp: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const requestId = (request.headers['x-request-id'] as string) || 'unknown';

    let errorCode: string = ErrorCode.VALIDATION_FAILED;
    let message: string = 'An error occurred';
    let details: unknown = undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as Record<string, unknown>;
      if (resp.code) {
        errorCode = resp.code as string;
      }
      if (resp.message) {
        message = Array.isArray(resp.message)
          ? (resp.message as string[]).join(', ')
          : (resp.message as string);
      }
      if (resp.details) {
        details = resp.details;
      }
    }

    if (status === 401) {
      if (message.toLowerCase().includes('expired')) {
        errorCode = ErrorCode.AUTH_TOKEN_EXPIRED;
      } else {
        errorCode = ErrorCode.AUTH_TOKEN_INVALID;
      }
    }

    const errorResponse: IExceptionResponse = {
      success: false,
      statusCode: status,
      data: new ErrorResponseDto(errorCode, message, details),
      requestId,
      timestamp: new Date().toISOString(),
    };

    this.logger.warn({
      statusCode: status,
      errorCode,
      path: request.url,
      method: request.method,
      requestId,
    });

    response.status(status).send(errorResponse);
  }
}
