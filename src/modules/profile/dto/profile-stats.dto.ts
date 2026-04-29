import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileStatsDto {
  @ApiProperty({ example: 42, description: 'Total content logged' })
  @Expose()
  totalLogged!: number;

  @ApiProperty({
    example: 4.2,
    description: 'Mean rating across all rated entries',
  })
  @Expose()
  meanRating!: number;

  @ApiProperty({ example: 7, description: 'Number of favorite entries' })
  @Expose()
  favoritesCount!: number;
}
