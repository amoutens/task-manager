import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { AuthModule } from 'src/auth/auth.module';
import { StatusModule } from 'src/status/status.module';
import { Status } from 'src/status/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TasksRepository, Status]),
    AuthModule,
    StatusModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
