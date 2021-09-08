import { Module, forwardRef } from '@nestjs/common';
import { NearService } from './near.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [NearService, PrismaService],
  exports: [NearService],
})
export class NearModule {}
