import { Injectable } from '@nestjs/common';
import { ChainService } from './chain/chain.service';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

Injectable();
export class AppService {
  constructor(private readonly chainService: ChainService) {}

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!!!!!!';
  }

  getHelloName(name: string): string {
    return `Hello ${name}!`;
  }

  async databaseInfo(args: any) {
    return [];
  }

  async pools(args: Prisma.PoolFindManyArgs) {
    return this.chainService.pools(args);
  }
}
