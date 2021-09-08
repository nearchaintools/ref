import { Module } from '@nestjs/common';
import { NearModule } from '../near/near.module';
import { RefModule } from '../near/ref.finance/ref.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CronService } from './cron.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { DiscordService } from './discord.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../configs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('INDEXER_HOST'),
        port: configService.get('INDEXER_PORT'),
        username: configService.get('INDEXER_USER'),
        password: configService.get('INDEXER_PASSWORD'),
        database: configService.get('INDEXER_DB'),
        // entities: [
        //   __dirname + '/../**/*.entity.ts',
        // ],
        synchronize: false,
      }),
    }),
    PrismaModule,
    NearModule,
    RefModule,
  ],
  providers: [DiscordService, CronService],
  exports: [CronService],
})
export class CronModule {}
