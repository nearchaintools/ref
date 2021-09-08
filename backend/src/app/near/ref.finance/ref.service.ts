import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NearService } from '../../near/near.service';
import {
  Prisma,
  Pool,
  ChainUpdateType,
  LiquidityDirection,
  SimplePoolLiquidity,
} from '@prisma/client';
import { IndexerService, ILiquidity } from '../indexer/indexer.service';
import { timestamp } from 'rxjs';

export type TQueryArgs = {
  where: object;
  skip: number;
  take: number;
  orderBy: object;
};

@Injectable()
export class RefService {
  constructor(private prisma: PrismaService, private indexer: IndexerService) {}

  async scrapSimplePoolLiquidity(): Promise<void> {
    /**
     *  0. chance update status
     *  1. get last saved timestamp
     *  2. scrap data from last timestamp till now
     *  3. save in database
     *  4. change update status
     */

    try {
      const chain = await this.prisma.chain.findFirst();

      await this.prisma.chainUpdates.upsert({
        where: {
          chainName_type: {
            chainName: chain.name,
            type: ChainUpdateType.LIQUIDITY,
          },
        },
        create: {
          chain: {
            connect: {
              name: chain.name,
            },
          },
          type: ChainUpdateType.LIQUIDITY,
          finishedAt: new Date(),
        },
        update: {
          startedAt: new Date(),
          finishedAt: null,
        },
      });

      const lastSavedTimestamp = await this.prisma.simplePoolLiquidity.findFirst(
        {
          orderBy: {
            timestamp: 'desc',
          },
          select: {
            timestamp: true,
          },
        }
      );

      //@ts-ignore
      const index = lastSavedTimestamp ? lastSavedTimestamp.timestamp : '0';
      const lastLiquidity: ILiquidity[] = await this.indexer.getLastLiquidity(
        index
      );

      const insertedData = await lastLiquidity.reduce<
        Promise<Prisma.SimplePoolLiquidityCreateManyInput[]>
      >(async (acc, current) => {
        const pool = await this.prisma.pool.findUnique({
          where: {
            id: current.pool_id,
          },
          include: {
            tokens: {
              include: {
                token: true,
              },
            },
          },
        });

        if (!pool) {
          throw new Error(`Pool ${current.pool_id} not found`);
        }

        return [
          ...(await acc),
          {
            timestamp: current.timestamp,
            poolId: current.pool_id,
            direction:
              current.method_name === 'add_liquidity'
                ? LiquidityDirection.POOL_IN
                : LiquidityDirection.POOL_OUT,
            accountAddress: current.receipt_predecessor_account_id,
            token1Amount:
              current.amount1 / Math.pow(10, pool.tokens[0].decimals),
            token2Amount:
              current.amount2 / Math.pow(10, pool.tokens[1].decimals),
            removedShares: current.removed_shares / NearService.DECIMAL_PLACES,
          },
        ];
      }, Promise.resolve([]));

      const data = insertedData;

      // ! delete or comment out
      //console.log(data.slice(1, 50));

      await this.prisma.simplePoolLiquidity.createMany({
        data,
      });

      await this.prisma.chainUpdates.update({
        where: {
          chainName_type: {
            chainName: chain.name,
            type: ChainUpdateType.LIQUIDITY,
          },
        },
        data: {
          finishedAt: new Date(),
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
