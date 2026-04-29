import { IApiResponse } from '../interfaces/api-response.interface';
export declare class ApiResponseDto<T> implements IApiResponse<T> {
    success: boolean;
    statusCode: number;
    data: T;
    requestId: string;
    timestamp: string;
    constructor(data: T, statusCode: number, requestId: string, success?: boolean);
}
