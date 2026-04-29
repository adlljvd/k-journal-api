import { ContentType } from '@prisma/client';
export declare class CreateContentDto {
    title: string;
    slug?: string;
    type: ContentType;
    year: number;
    synopsis?: string;
    posterUrl?: string;
    genres: string[];
    cast?: string;
    episodes?: number;
    durationMinutes?: number;
    country?: string;
    isFeatured?: boolean;
}
