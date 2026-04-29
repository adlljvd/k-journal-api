import { Module } from '@nestjs/common';
import { ContentRequestController } from './content-request.controller';
import { ContentRequestService } from './content-request.service';
import { ContentRequestRepository } from './content-request.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContentRequestController],
  providers: [ContentRequestService, ContentRequestRepository],
  exports: [ContentRequestService, ContentRequestRepository],
})
export class ContentRequestModule {}
