export class ErrorResponseDto {
  code: string;
  message: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    this.code = code;
    this.message = message;
    this.details = details;
  }
}
