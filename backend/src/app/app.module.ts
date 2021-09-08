import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChainModule } from './chain/chain.module';
import { IndexerModule } from './near/indexer/indexer.module';
import { ScheduleModule } from '@nestjs/schedule';
import config from '../configs/config';

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
    TasksModule,
    ChainModule,
    IndexerModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
