import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from 'class-validator';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { ErrorCode } from '../enums/error-code.enum';

interface IExceptionResponse {
  success: boolean;
  statusCode: number;
  data: ErrorResponseDto;
  requestId: string;
  timestamp: string;
}

interface IValidationError {
  property: string;
  value?: unknown;
  constraints?: Record<string, string>;
  children?: ValidationError[];
}

function flattenValidationErrors(
  errors: ValidationError[],
): IValidationError[] {
  const result: IValidationError[] = [];

  for (const error of errors) {
    if (error.constraints) {
      result.push({
        property: error.property,
        value: error.value,
        constraints: error.constraints,
      });
    }

    if (error.children && error.children.length > 0) {
      result.push(...flattenValidationErrors(error.children));
    }
  }

  return result;
}

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const requestId = (request.headers['x-request-id'] as string) || 'unknown';
    const exceptionResponse = exception.getResponse();
    const status = exception.getStatus();

    let validationErrors: IValidationError[] = [];

    let errorCode: string = ErrorCode.VALIDATION_FAILED;
    let message = 'Validation failed';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as Record<string, unknown>;
      if (resp.code) {
        errorCode = resp.code as string;
      }
      if (Array.isArray(resp.message)) {
        if (typeof resp.message[0] === 'string') {
          message = resp.message.join(', ');
        } else {
          const errors = resp.message as ValidationError[];
          validationErrors = flattenValidationErrors(errors);
          message = 'Validation failed';
        }
      } else if (resp.message && typeof resp.message === 'string') {
        message = resp.message;
      }
    }

    const errorDetails =
      validationErrors.length > 0 ? validationErrors : undefined;

    const errorResponse: IExceptionResponse = {
      success: false,
      statusCode: status,
      data: new ErrorResponseDto(errorCode, message, errorDetails),
      requestId,
      timestamp: new Date().toISOString(),
    };

    this.logger.warn({
      statusCode: status,
      errorCode,
      validationErrors: validationErrors.length,
      path: request.url,
      requestId,
    });

    response.status(status).send(errorResponse);
  }
}
