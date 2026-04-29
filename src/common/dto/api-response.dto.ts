import { IApiResponse } from '../interfaces/api-response.interface';

export class ApiResponseDto<T> implements IApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  requestId: string;
  timestamp: string;

  constructor(data: T, statusCode: number, requestId: string, success = true) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.requestId = requestId;
    this.timestamp = new Date().toISOString();
  }
}
