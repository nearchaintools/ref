import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BN from 'bn.js';
import { PrismaService } from '../prisma/prisma.service';
import { ChainConfig } from 'src/configs/config.interface';
import { convertBalance } from './near.utils';
import {
  Prisma,
  Token,
  PoolKind,
  TokenInPool,
  TokenInPoolHistory,
} from '@prisma/client';
import { keyStores, Near } from 'near-api-js';
import getConfig from './ref.finance/config';
import {
  IToken,
  IPool,
  TVolume,
  IFarm,
  ISeed,
  getFarmKind,
  getFarmStatus,
} from './ref.finance/types';
import os from 'os';
import path from 'path';

@Injectable()
export class NearService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  private config = getConfig();
  private readonly logger = new Logger(NearService.name);
  private near: Near;
  private MAX_PER_PAGE = 100;
  public static DECIMAL_PLACES = Math.pow(10, 24);

  async onModuleInit() {
    const homedir = os.homedir();
    const credentialsPath = path.join(homedir, '.near-credentials');
    const keyStore = new keyStores.UnencryptedFileSystemKeyStore(
      credentialsPath
    );

    this.near = new Near({
      keyStore,
      ...this.config,
    });
  }

  getHello(): string {
    return 'Hello World!!!!!!';
  }

  async view({ methodName, args = {} }: { methodName: string; args?: object }) {
    return (
      this.near.connection.provider
        .query({
          request_type: 'call_function',
          finality: 'final',
          account_id: this.config.REF_FI_CONTRACT_ID,
          method_name: methodName,
          args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        })
        //@ts-ignore
        .then(({ result }) => JSON.parse(Buffer.from(result).toString()))
        .catch((e) => console.log('Near connection error: ', e))
    );
  }

  async farmView({
    methodName,
    args = {},
  }: {
    methodName: string;
    args?: object;
  }) {
    return (
      this.near.connection.provider
        .query({
          request_type: 'call_function',
          finality: 'final',
          account_id: this.config.REF_FARM_CONTRACT_ID,
          method_name: methodName,
          args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        })
        //@ts-ignore
        .then(({ result }) => JSON.parse(Buffer.from(result).toString()))
        .catch((e) => console.log('Near connection error: ', e))
    );
  }

  // ----- Ref Finance Tokens ----------------
  // TODO move into ref.service
  async refIndexerGetTokens() {
    return await fetch(this.config.indexerUrl + '/list-token', {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((res) => res.json())
      .then((tokens) => {
        return tokens;
      });
  }

  public async refSaveTokens() {
    const tokens = await this.refIndexerGetTokens();
    const tokenArr: IToken[] = Object.keys(tokens).map((key) => ({
      id: key,
      name: tokens[key].name,
      symbol: tokens[key].symbol,
      decimals: tokens[key].decimals,
      icon: tokens[key].icon,
      spec: tokens[key].spec,
      reference: tokens[key].reference,
      referenceHash: tokens[key].referenceHash,
    }));
    for (let token of tokenArr) {
      try {
        await this.prisma.token.upsert({
          where: {
            contractId: token.id,
          },
          create: {
            contractId: token.id,
            name: token.name,
            decimals: token.decimals,
            symbol: token.symbol,
            icon: token.icon,
            spec: token.spec,
            reference: token.reference,
            referenceHash: token.referenceHash,
          },
          update: {
            name: token.name,
            decimals: token.decimals,
            symbol: token.symbol,
            icon: token.icon,
            spec: token.spec,
            reference: token.reference,
            referenceHash: token.referenceHash,
          },
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  // TODO move into ref.service
  async refIndexerGetPoolById(poolId: number) {
    return await fetch(
      this.config.indexerUrl + '/list-pools-by-ids?ids=' + poolId,
      {
        method: 'GET',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }
    )
      .then((res) => res.json())
      .then((pool) => {
        return pool;
      });
  }

  // ----- Ref Finance Pools ----------------

  refGetTotalPools() {
    const result = this.view({ methodName: 'get_number_of_pools' });
    return result;
  }

  refGetPools(page: number) {
    const index = (page - 1) * this.MAX_PER_PAGE;

    return this.view({
      methodName: 'get_pools',
      args: { from_index: index, limit: this.MAX_PER_PAGE },
    });
  }

  refGetPoolVolume(poolId: number) {
    return this.view({
      methodName: 'get_pool_volumes',
      args: { pool_id: poolId },
    });
  }

  async refSavePools() {
    const totalPools = await this.refGetTotalPools();
    const pages = Math.ceil(totalPools / this.MAX_PER_PAGE);
    for (let page = 1; page <= pages; page++) {
      const pools: IPool[] = await this.refGetPools(page);
      let i = 0;
      for (let i = 0; i <= pools.length - 1; i++) {
        const pool = pools[i];
        const poolId = (page - 1) * this.MAX_PER_PAGE + i;
        try {
          const token1 = await this.prisma.token.findUnique({
            where: {
              contractId: pool.token_account_ids[0],
            },
          });

          if (!token1) {
            throw new Error(
              `Cannot find token ${pool.token_account_ids[0]} in the database`
            );
          }

          const token2 = await this.prisma.token.findUnique({
            where: {
              contractId: pool.token_account_ids[1],
            },
          });

          if (!token2) {
            throw new Error(
              `Cannot find token ${pool.token_account_ids[2]} in the database`
            );
          }

          const tokensArr = [token1.symbol, token2.symbol];
          Logger.debug(`There are tokens ${tokensArr} in the pool id ${i}`);

          const poolExist = await this.prisma.pool.findUnique({
            where: {
              id: poolId,
            },
          });

          // get data from Ref Indexer
          const [poolIndexer] = await this.refIndexerGetPoolById(poolId);
          const tvl = poolIndexer.tvl ? parseFloat(poolIndexer.tvl) : 0;

          const poolDb = await this.prisma.pool.upsert({
            where: {
              id: poolId,
            },
            create: {
              id: poolId,
              tokensArr,
              fee: pool.total_fee / 100,
              totalShares:
                pool.shares_total_supply / NearService.DECIMAL_PLACES,
              poolKind: PoolKind.SIMPLE_POOL,
              tvl,
            },
            update: {
              fee: pool.total_fee / 100,
              totalShares:
                pool.shares_total_supply / NearService.DECIMAL_PLACES,
              tvl,
            },
          });

          const poolVolume: TVolume = await this.refGetPoolVolume(poolId);

          let token1InPool: TokenInPool;
          let token2InPool: TokenInPool;
          // create new tokens in pool records
          if (!poolExist) {
            token1InPool = await this.prisma.tokenInPool.create({
              data: {
                token: {
                  connect: {
                    id: token1.id,
                  },
                },
                pool: {
                  connect: {
                    id: poolDb.id,
                  },
                },
                amount: pool.amounts[0] / Math.pow(10, token1.decimals),
                symbol: token1.symbol,
                decimals: token1.decimals,
                contractId: token1.contractId,
                inputVolume:
                  poolVolume[0].input / Math.pow(10, token1.decimals),
                outputVolume:
                  poolVolume[0].output / Math.pow(10, token1.decimals),
              },
            });

            token2InPool = await this.prisma.tokenInPool.create({
              data: {
                token: {
                  connect: {
                    id: token2.id,
                  },
                },
                pool: {
                  connect: {
                    id: poolDb.id,
                  },
                },
                amount: pool.amounts[1] / Math.pow(10, token2.decimals),
                symbol: token2.symbol,
                decimals: token2.decimals,
                contractId: token2.contractId,
                inputVolume:
                  poolVolume[1].input / Math.pow(10, token2.decimals),
                outputVolume:
                  poolVolume[1].output / Math.pow(10, token2.decimals),
              },
            });
          } else {
            token1InPool = await this.prisma.tokenInPool.findUnique({
              where: {
                tokenId_poolId: {
                  tokenId: token1.id,
                  poolId: poolDb.id,
                },
              },
            });

            token2InPool = await this.prisma.tokenInPool.findUnique({
              where: {
                tokenId_poolId: {
                  tokenId: token2.id,
                  poolId: poolDb.id,
                },
              },
            });
          }

          // create token in pool history and simple pool swap history
          if (token1InPool && token2InPool) {
            const amount1 = pool.amounts[0] / Math.pow(10, token1.decimals);
            const amount2 = pool.amounts[1] / Math.pow(10, token2.decimals);

            const insertTokensHistory: Prisma.TokenInPoolHistoryCreateManyInput[] = [
              {
                tokenInPoolId: token1InPool.id,
                amount: amount1,
                inputVolume:
                  poolVolume[0].input / Math.pow(10, token1.decimals),
                outputVolume:
                  poolVolume[0].output / Math.pow(10, token1.decimals),
              },
              {
                tokenInPoolId: token2InPool.id,
                amount: amount2,
                inputVolume:
                  poolVolume[1].input / Math.pow(10, token2.decimals),
                outputVolume:
                  poolVolume[1].output / Math.pow(10, token2.decimals),
              },
            ];

            await this.prisma.tokenInPoolHistory.createMany({
              data: insertTokensHistory,
            });

            const insertAmountsHistory: Prisma.SimplePoolAmountHistoryCreateManyInput[] = [
              {
                tokenInPoolId: token1InPool.id,
                poolId: poolDb.id,
                token1Id: token1.id,
                token1Amount: amount1,
                token2Id: token2.id,
                token2Amount: amount2,
                swap1to2: amount2 !== 0 ? amount1 / amount2 : 0,
                swap2to1: amount1 !== 0 ? amount2 / amount1 : 0,
                tvl,
              },
            ];
            await this.prisma.simplePoolAmountHistory.createMany({
              data: insertAmountsHistory,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  refGetDeposits(accountAddress: string) {
    return this.view({
      methodName: 'get_deposits',
      args: { account_id: accountAddress },
    });
  }

  refGetPoolShares(poolId: number, accountAddress: string) {
    return this.view({
      methodName: 'get_pool_shares',
      args: { pool_id: poolId, account_id: accountAddress },
    });
  }

  // ---- FARMS ----

  refGetFramsMetadata() {
    return this.farmView({
      methodName: 'get_metadata',
    });
  }

  refGetSeeds(page: number) {
    const index = (page - 1) * this.MAX_PER_PAGE;

    return this.farmView({
      methodName: 'list_seeds_info',
      args: { from_index: index, limit: this.MAX_PER_PAGE },
    });
  }

  async refSaveSeeds() {
    const metadata = await this.refGetFramsMetadata();
    const totalFarms = parseInt(metadata['seed_count']);
    const pages = Math.ceil(totalFarms / this.MAX_PER_PAGE);
    for (let page = 1; page <= pages; page++) {
      const seedsObj = await this.refGetSeeds(page);
      let i = 0;
      for (const [key, seed] of Object.entries<ISeed>(seedsObj)) {
        const seedId = (page - 1) * this.MAX_PER_PAGE + i;
        try {
          await this.prisma.seed.upsert({
            where: {
              seedId: seed.seed_id,
            },
            create: {
              id: seedId,
              seedId: seed.seed_id,
              type: seed.seed_type,
              nextIndex: seed.next_index,
              amount: seed.amount / NearService.DECIMAL_PLACES,
              minDeposit: seed.min_deposit / NearService.DECIMAL_PLACES,
            },
            update: {
              nextIndex: seed.next_index,
              amount: seed.amount / NearService.DECIMAL_PLACES,
              minDeposit: seed.min_deposit / NearService.DECIMAL_PLACES,
            },
          });
        } catch (e) {
          throw new Error(e);
        }
        i++;
      }
    }
  }

  refGetFarms(page: number) {
    const index = (page - 1) * this.MAX_PER_PAGE;

    return this.farmView({
      methodName: 'list_farms',
      args: { from_index: index, limit: this.MAX_PER_PAGE },
    });
  }

  async refSaveFarms() {
    const metadata = await this.refGetFramsMetadata();
    const totalFarms = parseInt(metadata['farm_count']);
    const pages = Math.ceil(totalFarms / this.MAX_PER_PAGE);
    for (let page = 1; page <= pages; page++) {
      const farms: IFarm[] = await this.refGetFarms(page);
      let i = 0;
      for (let i = 0; i <= farms.length - 1; i++) {
        const farm = farms[i];
        const farmId = (page - 1) * this.MAX_PER_PAGE + i;
        try {
          const rewardToken = await this.prisma.token.findUnique({
            where: {
              contractId: farm.reward_token,
            },
          });

          if (!rewardToken) {
            throw new Error(
              `Cannot find token ${farm.reward_token} in the database`
            );
          }

          const seed = await this.prisma.seed.findUnique({
            where: {
              seedId: farm.seed_id,
            },
          });

          if (!seed) {
            throw new Error(`Cannot find Seed ${farm.seed_id} in the database`);
          }

          const poolIdFromFarm = parseInt(
            farm.farm_id.slice(
              farm.farm_id.indexOf('@') + 1,
              farm.farm_id.lastIndexOf('#')
            )
          );

          const pool = await this.prisma.pool.findUnique({
            where: {
              id: poolIdFromFarm,
            },
          });

          if (!pool) {
            throw new Error(
              `Cannot find Pool ${poolIdFromFarm} in the database`
            );
          }

          await this.prisma.farm.upsert({
            where: {
              farmId: farm.farm_id,
            },
            create: {
              id: farmId,
              farmId: farm.farm_id,
              farmKind: getFarmKind(farm.farm_kind),
              status: getFarmStatus(farm.farm_status),
              seedId: seed.id,
              rewardTokenId: rewardToken.id,
              simplePoolId: pool.id,
              startAt: farm.start_at,
              rewardPerSession:
                farm.reward_per_session / Math.pow(10, rewardToken.decimals),
              sessionInterval: farm.session_interval,
              totalReward:
                farm.total_reward / Math.pow(10, rewardToken.decimals),
              currentRound: farm.cur_round,
              lastRound: farm.last_round,
              claimedReward:
                farm.claimed_reward / Math.pow(10, rewardToken.decimals),
              unclaimedReward:
                farm.unclaimed_reward / Math.pow(10, rewardToken.decimals),
              beneficaryReward: farm.beneficary_reward
                ? farm.beneficary_reward / Math.pow(10, rewardToken.decimals)
                : 0,
            },
            update: {
              currentRound: farm.cur_round,
              lastRound: farm.last_round,
              claimedReward:
                farm.claimed_reward / Math.pow(10, rewardToken.decimals),
              unclaimedReward:
                farm.unclaimed_reward / Math.pow(10, rewardToken.decimals),
              beneficaryReward: farm.beneficary_reward
                ? farm.beneficary_reward / Math.pow(10, rewardToken.decimals)
                : 0,
            },
          });
        } catch (e) {
          throw new Error(e);
        }
      }
    }
  }

  refGetUserSeeds(accountAddress: string) {
    return this.farmView({
      methodName: 'list_user_seeds',
      args: { account_id: accountAddress },
    });
  }

  refGetUserUnclaimedRewards(accountAddress: string, farmId: string) {
    return this.farmView({
      methodName: 'get_unclaimed_reward',
      args: { account_id: accountAddress, farm_id: farmId },
    });
  }

  refGetUserRewardsForToken(accountAddress: string, tokenId: string) {
    return this.farmView({
      methodName: 'get_reward',
      args: { account_id: accountAddress, token_id: tokenId },
    });
  }

  refGetUserRewards(accountAddress: string) {
    return this.farmView({
      methodName: 'list_rewards',
      args: { account_id: accountAddress },
    });
  }
}
