import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NearModule } from '../near/near.module';
import { IndexerModule } from '../near/indexer/indexer.module';

@Module({
  imports: [PrismaModule, NearModule, IndexerModule],
  providers: [ChainService],
  exports: [ChainService],
})
export class ChainModule {}
