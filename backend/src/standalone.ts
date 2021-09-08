import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CronModule } from './app/tasks/cron.module';
import { CronService } from './app/tasks/cron.service';
import { DiscordService } from './app/tasks/discord.service';
import { TasksConfig } from './configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CronModule);

  // const configService = app.get(ConfigService);
  // const cronService = app.get(CronService);
  // cronService.getCronJobs();

  // const discordService = app.get(DiscordService);
  // discordService.loginClient();
}
bootstrap();
