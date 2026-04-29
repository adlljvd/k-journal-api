import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '../../../common/enums/content-type.enum';
import { RequestStatus } from '../../../common/enums/request-status.enum';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ContentRequestEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  userId!: string;

  @ApiProperty({ example: 'My Love from the Star' })
  @Expose()
  title!: string;

  @ApiProperty({ enum: ContentType, example: ContentType.DRAMA })
  @Expose()
  type!: ContentType;

  @ApiPropertyOptional({ example: 2013 })
  @Expose()
  year?: number | null;

  @ApiPropertyOptional({ example: 'Please add this drama, it is a classic!' })
  @Expose()
  notes?: string | null;

  @ApiProperty({ enum: RequestStatus, example: RequestStatus.PENDING })
  @Expose()
  status!: RequestStatus;

  @ApiPropertyOptional({ example: 'This title is already in the catalog.' })
  @Expose()
  rejectionReason?: string | null;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  contentId?: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiPropertyOptional({ example: '2024-01-02T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  reviewedAt?: Date | null;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  reviewedBy?: string | null;

  constructor(partial: Partial<ContentRequestEntity>) {
    Object.assign(this, partial);
  }
}
