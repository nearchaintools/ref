import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

  async deleteDatabase() {
    await this.simplePoolAmountHistory.deleteMany({});
    await this.tokenInPoolHistory.deleteMany({});
    await this.tokenInPool.deleteMany({});
    await this.token.deleteMany({});
    await this.pool.deleteMany({});
    console.log('Database Tables Deleted');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
