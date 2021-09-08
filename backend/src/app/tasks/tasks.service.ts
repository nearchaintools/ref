import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { NearService } from '../near/near.service';
import { RefService } from '../near/ref.finance/ref.service';
import * as dotenv from 'dotenv';

dotenv.config();

// TODO - don't do declarative Crons because it cannot use ConfigService
const CRON_LIQUIDITY = process.env.CRON_LIQUIDITY || '*/1 * * * *'; // every 3 minutes
const CRON_POOLS = process.env.CRON_POOLS || '*/5 * * * * ';
const CRON_TOKENS = process.env.CRON_TOKENS || '*/4 * * * * *';

@Injectable()
export class TasksService {
  constructor(
    private readonly nearService: NearService,
    private readonly refService: RefService
  ) {}
  private readonly logger = new Logger(TasksService.name);

  //   @Cron(CRON_LIQUIDITY, {
  //     name: 'liquidity',
  //     timeZone: 'Europe/Paris',
  //   })
  //   async updateLiquidityCron() {
  //     this.logger.debug('Started by cron updateLiquidityCron');
  //     //await this.refService.scrapSimplePoolLiquidity();
  //     await setTimeout(() => Promise.resolve(console.log('...waited')), 3000);
  //   }
}
