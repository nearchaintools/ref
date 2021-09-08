import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { NearModule } from '../near/near.module';
import { RefModule } from '../near/ref.finance/ref.module';

/**
 * The purpose of this module is to be implemented and start small taksk
 * inside the main program
 * Consider to use cron.module inside of standalone application to run heavy load taksk
 */
@Module({
  imports: [NearModule, RefModule],
  providers: [TasksService],
})
export class TasksModule {}
