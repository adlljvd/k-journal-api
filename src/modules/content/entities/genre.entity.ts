import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GenreEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Romance' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 'romance' })
  @Expose()
  slug!: string;

  constructor(partial: Partial<GenreEntity>) {
    Object.assign(this, partial);
  }
}
