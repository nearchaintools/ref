import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Cron } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NearService } from '../near/near.service';
import { RefService } from '../near/ref.finance/ref.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TasksConfig } from 'src/configs/config.interface';
import * as dotenv from 'dotenv';

dotenv.config();

// TODO - don't do declarative Crons because it cannot use ConfigService
const CRON_LIQUIDITY = process.env.CRON_LIQUIDITY || '*/2 * * * *';
const CRON_TOKENS = process.env.CRON_TOKENS || '*/3 * * * *';
const CRON_POOLS = process.env.CRON_POOLS || '*/5 * * * * ';
const CRON_FARMS = process.env.CRON_FARMS || '*/11 * * * * ';

@Injectable()
export class CronService {
  constructor(
    private readonly nearService: NearService,
    private readonly refService: RefService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}
  private readonly logger = new Logger(CronService.name);
  private readonly tasksConfig = this.configService.get<TasksConfig>('tasks');

  public getCronJobs() {
    // test cronů
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }

  /**
   * https://cronjob.xyz/ - withouts seconds
   * https://www.freeformatter.com/cron-expression-generator-quartz.html
   */

  // Declarative crons
  @Cron(CRON_LIQUIDITY, {
    name: 'liquidity',
    timeZone: 'Europe/Paris',
  })
  async updateLiquidityCron() {
    this.logger.debug('Started by cron updateLiquidityCron');

    // test the functionality
    //await setTimeout(() => Promise.resolve(console.log('...waited')), 3000);

    await this.refService.scrapSimplePoolLiquidity();

    const job = this.schedulerRegistry.getCronJob('liquidity');
    let next;
    try {
      next = job.nextDates().toDate();
    } catch (e) {
      next = 'error: next fire date is in the past!';
    }
    this.logger.log(`-------------- liquidity cron finished ---------------`);
    this.logger.log(`Next time: ${next}`);
    this.logger.log(`--------------------------------------`);
  }

  @Cron(CRON_TOKENS, {
    name: 'tokens',
    timeZone: 'Europe/Paris',
  })
  async updatePoolsTokens() {
    this.logger.debug('Started by cron updatePoolsTokens');
    await this.nearService.refSaveTokens();

    const job = this.schedulerRegistry.getCronJob('tokens');
    let next;
    try {
      next = job.nextDates().toDate();
    } catch (e) {
      next = 'error: next fire date is in the past!';
    }
    this.logger.log(`-------------- tokens cron finished ---------------`);
    this.logger.log(`Next time: ${next}`);
    this.logger.log(`--------------------------------------`);
  }

  @Cron(CRON_POOLS, {
    name: 'pools',
    timeZone: 'Europe/Paris',
  })
  async updatePoolsCron() {
    this.logger.debug('Started by cron updatePoolsCron');
    await this.nearService.refSavePools();

    const job = this.schedulerRegistry.getCronJob('pools');
    let next;
    try {
      next = job.nextDates().toDate();
    } catch (e) {
      next = 'error: next fire date is in the past!';
    }
    this.logger.log(`-------------- pools cron finished ---------------`);
    this.logger.log(`Next time: ${next}`);
    this.logger.log(`--------------------------------------`);
  }

  @Cron(CRON_POOLS, {
    name: 'farms',
    timeZone: 'Europe/Paris',
  })
  async updateFarmsCron() {
    this.logger.debug('Started by cron updateFarmsCron');
    await this.nearService.refSaveSeeds();
    await this.nearService.refSaveFarms();

    const job = this.schedulerRegistry.getCronJob('farms');
    let next;
    try {
      next = job.nextDates().toDate();
    } catch (e) {
      next = 'error: next fire date is in the past!';
    }
    this.logger.log(`-------------- farms cron finished ---------------`);
    this.logger.log(`Next time: ${next}`);
    this.logger.log(`--------------------------------------`);
  }
}
