import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { RequestStatus } from '../../../common/enums/request-status.enum';

export class QueryContentRequestDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({
    enum: RequestStatus,
    enumName: 'RequestStatus',
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}
