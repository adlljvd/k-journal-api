import { UserProfileEntity } from '../../user/entities/user-profile.entity';
import { ContentEntity } from '../../content/entities/content.entity';
import { ProfileStatsDto } from './profile-stats.dto';
export declare class PublicProfileDto {
    id: string;
    username: string;
    profile?: UserProfileEntity;
    profileFavorites?: ContentEntity[];
    stats: ProfileStatsDto;
}
