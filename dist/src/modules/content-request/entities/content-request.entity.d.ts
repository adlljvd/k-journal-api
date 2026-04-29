import { ContentType } from '../../../common/enums/content-type.enum';
import { RequestStatus } from '../../../common/enums/request-status.enum';
export declare class ContentRequestEntity {
    id: string;
    userId: string;
    title: string;
    type: ContentType;
    year?: number | null;
    notes?: string | null;
    status: RequestStatus;
    rejectionReason?: string | null;
    contentId?: string | null;
    createdAt: Date;
    reviewedAt?: Date | null;
    reviewedBy?: string | null;
    constructor(partial: Partial<ContentRequestEntity>);
}
