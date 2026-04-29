import { IPaginatedResponse } from '../interfaces/api-response.interface';
export declare class PaginatedResponseDto<T> implements IPaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    constructor(items: T[], total: number, page: number, limit: number);
}
