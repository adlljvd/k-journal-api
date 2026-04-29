import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSearchResultDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'kdrama_fan' })
  @Expose()
  username!: string;

  @ApiPropertyOptional({
    example: {
      avatarUrl: 'https://example.com/avatar.jpg',
      bio: 'K-drama enthusiast',
    },
  })
  @Expose()
  profile?: {
    avatarUrl: string | null;
    bio: string | null;
  };
}
