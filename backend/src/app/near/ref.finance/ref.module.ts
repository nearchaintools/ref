import { Module } from '@nestjs/common';
import { IndexerModule } from '../indexer/indexer.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { RefService } from './ref.service';

@Module({
  imports: [IndexerModule, PrismaModule],
  providers: [RefService],
  exports: [RefService],
})
export class RefModule {}
