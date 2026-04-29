import { ContentType } from '@prisma/client';
export declare class QueryAdminContentDto {
    page: number;
    limit: number;
    search?: string;
    type?: ContentType;
    sort?: string;
    order?: 'asc' | 'desc';
}
