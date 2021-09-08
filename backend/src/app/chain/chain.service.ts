import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NearService } from '../near/near.service';
import { ConfigService } from '@nestjs/config';
import { Prisma, Pool, FarmStatus } from '@prisma/client';
import { IndexerService, TQueryArgs } from '../near/indexer/indexer.service';

type TPool = Pool & { accountShares: number };

@Injectable()
export class ChainService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly near: NearService,
    private readonly indexer: IndexerService
  ) {}

  async refStats() {
    const nrOfTokens = await this.prisma.token.count();
    const nrOfPools = await this.prisma.pool.count();
    const nrOfFarms = await this.prisma.farm.count({
      where: {
        status: FarmStatus.RUNNING,
      },
    });
    const TVL = await this.prisma.pool.aggregate({
      _sum: {
        tvl: true,
      },
    });
    const stats = {
      nrOfTokens,
      nrOfPools,
      nrOfFarms,
      TVL: TVL._sum.tvl,
      volume24: 'N/A',
    };
    return stats;
  }

  async tokens(args: Prisma.TokenFindManyArgs) {
    const data = await this.prisma.token.findMany({
      ...args,
    });

    return data;
  }

  async pools(args: Prisma.PoolFindManyArgs) {
    const count = await this.prisma.pool.count({ where: args.where });
    const pools = await this.prisma.pool.findMany({
      ...args,
      include: {
        tokens: {
          include: {
            token: true,
          },
        },
      },
    });

    const result = {
      pools,
      count,
    };

    return result;
  }

  async poolDetail(id: number) {
    const pool = await this.prisma.pool.findUnique({
      where: {
        id,
      },
      include: {
        tokens: {
          include: {
            token: true,
          },
        },
      },
    });

    return pool;
  }

  async poolTokens(poolId: number, tokenIndex?: number) {
    const toTimestamp = (strDate) => {
      const datum = Date.parse(strDate);
      return datum;
    };

    const swapHistory = await this.prisma.simplePoolAmountHistory.findMany({
      where: {
        poolId,
      },
    });

    const pool = await this.prisma.pool.findUnique({
      where: {
        id: poolId,
      },
      include: {
        tokens: {
          include: {
            token: true,
          },
        },
      },
    });
    const token1 = pool.tokens[0];
    const token2 = pool.tokens[1];

    const priceArr1 = [];
    const priceArr2 = [];
    for (const history of swapHistory) {
      const timestamp = toTimestamp(history.createdAt);

      priceArr1.push({
        timestamp,
        dateTime: history.createdAt,
        price: history.swap1to2.toNumber(),
      });

      priceArr2.push({
        timestamp,
        dateTime: history.createdAt,
        price: history.swap2to1.toNumber(),
      });
    }

    const result = [
      {
        id: 1,
        token1: {
          symbol: token1.symbol,
          prices: priceArr1,
        },
        token2: {
          symbol: token2.symbol,
          prices: priceArr2,
        },
      },
    ];

    return result;
  }

  async accountDeposits(accountAddress: string) {
    const deposits = await this.near.refGetDeposits(accountAddress);
    if (!deposits) {
      throw new Error(`Address ${accountAddress} has not been found`);
    }
    const tokens = Object.keys(deposits);
    let i = 1;
    const result = [];
    for (const tokenContract of tokens) {
      const tokenDb = await this.prisma.token.findUnique({
        where: { contractId: tokenContract },
      });
      if (tokenDb) {
        const restultObj = {
          id: i,
          symbol: tokenDb.symbol,
          contractId: tokenDb.contractId,
          icon: tokenDb.icon,
          amount: deposits[tokenContract] / Math.pow(10, tokenDb.decimals),
        };
        result.push(restultObj);
        i++;
      } else {
        throw new Error(
          `Token ${tokenContract} has not been found in the database`
        );
      }
    }

    return result;
  }

  async accountPools(accountAddress: string) {
    /**
     * ??? How to get accounts pool ???
     * 1/ get accounts deposits
     * 2/ assume that deposited token should be also in the pool
     * 3/ go through all pools with the same token
     * 4/ for every founded pool try to get accounts shares
     * 5/ i account shares are found, list that pool
     */

    const result: TPool[] = [];
    const deposits = await this.near.refGetDeposits(accountAddress);
    if (!deposits) {
      return result;
    }
    const tokens = Object.keys(deposits);
    let i = 1;
    for (const tokenContract of tokens) {
      const tokenInPoolDb = await this.prisma.tokenInPool.findMany({
        where: {
          contractId: tokenContract,
        },
      });

      for (const inPoolItem of tokenInPoolDb) {
        const accountShares = await this.near.refGetPoolShares(
          inPoolItem.poolId,
          accountAddress
        );

        if (accountShares > 0) {
          const pool = await this.prisma.pool.findUnique({
            where: {
              id: inPoolItem.poolId,
            },
            include: {
              tokens: {
                include: {
                  token: true,
                },
              },
            },
          });

          // there are two tokens in the pool, so we have to push only distinc values
          const index = result.findIndex((item) => item.id === pool.id);
          if (index === -1) {
            result.push({
              accountShares: accountShares / NearService.DECIMAL_PLACES,
              ...pool,
            });
          }
        }
      }
    }
    return result;
  }

  async simplePoolLiquidity(args: Prisma.SimplePoolLiquidityFindManyArgs) {
    const liquidity = await this.prisma.simplePoolLiquidity.findMany({
      ...args,
      include: {
        pool: {
          include: {
            tokens: true,
          },
        },
      },
    });

    const result = liquidity.map((item) => ({
      ...item,
      id: item.timestamp,
      dateTime: new Date(parseFloat(item.timestamp) / 1000000), // use https://www.epochconverter.com/ to validate
    }));

    return result;
  }

  async farms(args: Prisma.FarmFindManyArgs) {
    const data = await this.prisma.farm.findMany({
      ...args,
      include: {
        simplePool: {
          include: {
            tokens: {
              include: {
                token: true,
              },
            },
          },
        },
        rewardToken: true,
        seed: true,
      },
    });

    return data;
  }

  async accountRewards(accountAddress: string) {
    const result = [];
    const rewards = await this.near.refGetUserRewards(accountAddress);
    if (!rewards) {
      return result;
    }
    for (const [tokenId, amount] of Object.entries<string>(rewards)) {
      try {
        const tokenDb = await this.prisma.token.findUnique({
          where: {
            contractId: tokenId,
          },
        });

        result.push({
          id: tokenId,
          symbol: tokenDb.symbol,
          amount: parseInt(amount) / Math.pow(10, tokenDb.decimals),
        });

        if (!tokenDb) {
          throw new Error(
            `Token with contract id ${tokenId} was not find in the database`
          );
        }
      } catch (e) {
        throw new Error(e);
      }
    }
    return result;
  }

  async accountFarms(accountAddress: string) {
    let result = [];
    const seeds = await this.near.refGetUserSeeds(accountAddress);
    if (!seeds) {
      return result;
    }
    for (const [seed, shares] of Object.entries<string>(seeds)) {
      try {
        const poolId = seed.slice(seed.indexOf('@') + 1);
        const farm = await this.prisma.farm.findFirst({
          where: {
            farmId: {
              contains: seed,
            },
          },
          include: {
            simplePool: {
              include: {
                tokens: {
                  include: {
                    token: true,
                  },
                },
              },
            },
            rewardToken: true,
            seed: true,
          },
        });

        if (!farm) {
          throw new Error(`Cannot find Farm ${poolId} in the database`);
        } else {
          const unclaimedRewards =
            (await this.near.refGetUserUnclaimedRewards(
              accountAddress,
              farm.farmId
            )) / Math.pow(10, farm.rewardToken.decimals);

          const resultObj = {
            ...farm,
            accountUnclaimedRewards: unclaimedRewards,
            accountShares: parseInt(shares) / NearService.DECIMAL_PLACES,
          };
          result.push(resultObj);
        }
      } catch (e) {
        throw new Error(e);
      }
    }
    return result;
  }
}
