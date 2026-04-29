import { RequestStatus } from '../../../common/enums/request-status.enum';
export declare class QueryContentRequestDto {
    page: number;
    limit: number;
    status?: RequestStatus;
}
