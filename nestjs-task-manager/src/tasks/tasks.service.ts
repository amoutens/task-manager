import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {TaskStatus} from './task-status.enum'
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { Status } from 'src/status/status.entity';
import { bgColorTaskCard } from 'src/utils/constants';
import { TaskRepository } from './tasks.repository';
import { StatusRepository } from 'src/status/status.repository';
import { ITaskRepository } from './tasks.repository.interface';
import { IStatusRepository } from 'src/status/status.repository.interface';
import { In } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
      @Inject(TaskRepository) // DIP: depends on abstraction (interface)
      private readonly tasksRepository: ITaskRepository,
      @Inject(StatusRepository)
      private readonly statRepo: IStatusRepository
    ) {}
      
    // SRP: Only retrieves tasks with filtering logic.
    // OCP: Easily extendable for new filters without modifying method.
    async GetTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
      return this.tasksRepository.getTasks(user.id, filterDto);
    }
    
    // SRP: Only creates a task.
    // DIP: Uses repository interface, not direct implementation.
    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Partial<Task>> {
        const { title, description, status } = createTaskDTO;
        let statusDetails: { name: string | TaskStatus; color: string }
        const statusByType = await this.getStatusByType(status);
        const name = typeof statusByType === 'string' ? statusByType : statusByType.name;
        const color = typeof statusByType === 'string'
            ? bgColorTaskCard[statusByType]
            : statusByType.color;
        statusDetails = { name, color };
        
        const taskData = {
          title,
          description,
          status: statusDetails, 
          user
        }
        await this.tasksRepository.createTask(taskData)
        return {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status
        };
    }
    
    // SRP: Only gets a task by id.
    // DIP: Uses repository interface.
    async getTaskById(id: string, user: User): Promise<Task> {
      return await this.tasksRepository.findTaskById(id, user);
    }

    // SRP: Only deletes a task.
    // DIP: Uses repository interface.
    async deleteTaskById (id:string, user: User): Promise<void> {
      await this.tasksRepository.deleteTaskById(id, user);
    }

    // SRP: Only updates a task.
    // DIP: Uses repository interface.
    async updateTask(id: string, updateTaskDTO: UpdateTaskDTO, user: User): Promise<Task> {
      const task = await this.getTaskById(id, user);
      const { title, description, status } = updateTaskDTO;
      if (title !== undefined) {
        task.title = title;
      }
      if (description !== undefined) {
        task.description = description;
      }
      if (status !== undefined) {
        const statusByType = await this.getStatusByType(status);
        const name = typeof statusByType === 'string' ? statusByType : statusByType.name;
        const color = typeof statusByType === 'string'
            ? bgColorTaskCard[statusByType]
            : statusByType.color;
        task.status = { name, color };
        }
      await this.tasksRepository.saveTask(task);
      return task;
    }
    
  private async getStatusByType(status: TaskStatus | string): Promise<string | Status> {
    if (Object.values(TaskStatus).includes(status as TaskStatus)) {
      return status as string;
    }
    const foundStatus = await this.statRepo.findStatus(status as string);
    return foundStatus;
  }
}
