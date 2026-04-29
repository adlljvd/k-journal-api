import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMaxSize } from 'class-validator';

export class SetProfileFavoritesDto {
  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Array of journal entry IDs (max 4)',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMaxSize(4)
  entryIds!: string[];
}
