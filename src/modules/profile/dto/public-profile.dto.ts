import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserProfileEntity } from '../../user/entities/user-profile.entity';
import { ContentEntity } from '../../content/entities/content.entity';
import { ProfileStatsDto } from './profile-stats.dto';

@Exclude()
export class PublicProfileDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'kdrama_fan' })
  @Expose()
  username!: string;

  @ApiPropertyOptional({ type: () => UserProfileEntity })
  @Expose()
  @Type(() => UserProfileEntity)
  profile?: UserProfileEntity;

  @ApiPropertyOptional({
    type: [ContentEntity],
    description: 'Profile favorites (up to 4)',
  })
  @Expose()
  @Type(() => ContentEntity)
  profileFavorites?: ContentEntity[];

  @ApiProperty({ type: ProfileStatsDto })
  @Expose()
  @Type(() => ProfileStatsDto)
  stats!: ProfileStatsDto;
}
