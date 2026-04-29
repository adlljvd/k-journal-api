import { ContentType } from '../../../common/enums/content-type.enum';
export declare enum ContentSortBy {
    TITLE = "title",
    YEAR = "year",
    RATING = "rating"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class QueryContentDto {
    page: number;
    limit: number;
    type?: ContentType | 'ALL';
    genres?: string;
    sort: ContentSortBy;
    order: SortOrder;
}
