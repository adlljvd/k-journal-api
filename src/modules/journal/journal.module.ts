import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalRepository } from './journal.repository';
import { JournalController } from './journal.controller';
import { ContentModule } from '../content/content.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ContentModule, UserModule],
  controllers: [JournalController],
  providers: [JournalService, JournalRepository],
  exports: [JournalService, JournalRepository],
})
export class JournalModule {}
