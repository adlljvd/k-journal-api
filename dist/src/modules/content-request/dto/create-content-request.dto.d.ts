import { ContentType } from '../../../common/enums/content-type.enum';
export declare class CreateContentRequestDto {
    title: string;
    type: ContentType;
    year?: number;
    notes?: string;
}
