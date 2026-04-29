export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    data: T;
    requestId: string;
    timestamp: string;
}
export interface IPaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
