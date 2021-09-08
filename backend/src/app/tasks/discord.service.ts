import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Cron } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NearService } from '../near/near.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TasksConfig } from 'src/configs/config.interface';
//import Discord from 'discord.js';

@Injectable()
export class DiscordService {
  constructor(
    private readonly nearService: NearService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}
  private readonly logger = new Logger(DiscordService.name);
  private readonly tasksConfig = this.configService.get<TasksConfig>('tasks');

  loginClient = () => {
    /*
    const client = new Discord.Client({ intents: 5 });

    client.on('ready', () => {
      console.log(`Logged in Discord as ${client.user.tag}`);
    });

    client.on('message', (msg) => {
      if (msg.content === 'ping') {
        msg.reply('pong');
      }
    });

    client.on('message', async (msg) => {
      if (msg.content === '!drip') {
        const status = 'Status';
        msg.reply(JSON.stringify(status, undefined, 2));
      }
    });

    client.login(process.env.BOT_TOKEN);
    */
  };
}
