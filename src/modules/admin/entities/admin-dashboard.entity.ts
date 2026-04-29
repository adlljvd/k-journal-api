import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ContentRequestEntity } from '../../content-request/entities/content-request.entity';

export class AdminDashboardEntity {
  @ApiProperty({ example: 5 })
  @Expose()
  pendingRequestsCount!: number;

  @ApiProperty({ example: 150 })
  @Expose()
  totalContentCount!: number;

  @ApiProperty({ type: [ContentRequestEntity] })
  @Expose()
  @Type(() => ContentRequestEntity)
  recentRequests!: ContentRequestEntity[];

  constructor(partial: Partial<AdminDashboardEntity>) {
    Object.assign(this, partial);
  }
}
