import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StatusModule } from 'src/status/status.module';
import { Status } from 'src/status/status.entity';
import { TaskRepository } from './tasks.repository';
import { StatusRepository } from 'src/status/status.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Status]),
    AuthModule,
    StatusModule
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskRepository,
    StatusRepository,
  ]
})
export class TasksModule {}
