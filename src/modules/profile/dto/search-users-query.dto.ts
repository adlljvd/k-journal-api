import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchUsersQueryDto {
  @ApiProperty({
    example: 'kdrama',
    description: 'Search query for username (partial match)',
  })
  @IsString()
  q!: string;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Maximum number of results',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
