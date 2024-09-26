import { Injectable, NotFoundException } from '@nestjs/common';
import {TaskStatus} from './task-status.enum'
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { error } from 'console';
// import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Status } from 'src/status/status.entity';

@Injectable()

export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        // @InjectRepository(TasksRepository)
        // private tasksRepo: TasksRepository,
        @InjectRepository(Status)
        private statRepo : Repository<Status>
      ) {}
      async findStatus(name: string): Promise<Status> {
        const status = await this.statRepo.findOne({where : {name}});
        if(!status) {
            throw new NotFoundException('Individual status not found');
        }
        return status;
      }

      async GetTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.tasksRepository.createQueryBuilder('task');
      
        // query.where('task.user = :user', { user });
        query.where('task.userId = :userId', { userId: user.id });
        
        if (status) {
          if (Object.values(TaskStatus).includes(status as TaskStatus)) {
            query.andWhere('task.status ->> \'name\' = :status', { status });
          } else {
            query.andWhere('task.status.name = :status', { status });
          }
        }
      
        if (search) {
          query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            { search: `%${search}%` }
          );
        }
      
        const tasks = await query.getMany();
        return tasks;
      }
      
      
        async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
            const { title, description, status } = createTaskDTO;
          
            let statusDetails: { name: string | TaskStatus; color: string } | null = null;
            const bgColorTaskCard = {
              OPEN: 'rgb(231, 56, 56, 70%)',
              IN_PROGRESS: 'rgb(115, 13, 115, 70%)',
              DONE: 'rgb(56, 157, 45, 70%)',
            };
            if (Object.values(TaskStatus).includes(status as TaskStatus)) {
              const taskStatus = status as TaskStatus;
              statusDetails = {
                name: taskStatus,
                color: bgColorTaskCard[taskStatus],
              };
            } else {
              const foundStatus = await this.findStatus(status as string);
              statusDetails = {
                name: foundStatus.name,
                color: foundStatus.color,
              };
            }
          
            const task = this.tasksRepository.create({
              title,
              description,
              status: statusDetails, 
              user,
            });
          
            await this.tasksRepository.save(task);
            return task;
          }
          
          
    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({where: {id, user: {id: user.id}}});
        if(!found) throw new NotFoundException(`Task with ID "${id}" not found`);
        return found
    }
    async deleteTaskById (id:string, user: User): Promise<void> {
        const found = await this.tasksRepository.delete({id, user});
        if (found.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
          }
    }

    async updateTask(id: string, updateTaskDTO: UpdateTaskDTO, user: User): Promise<Task> {
      const bgColorTaskCard = {
        OPEN: 'rgb(231, 56, 56, 70%)',
        IN_PROGRESS: 'rgb(115, 13, 115, 70%)',
        DONE: 'rgb(56, 157, 45, 70%)',
      };
      const task = await this.getTaskById(id, user);
      const { title, description, status } = updateTaskDTO;
  
      if (title !== undefined) {
        task.title = title;
      }
  
      if (description !== undefined) {
        task.description = description;
      }
  
      if (status !== undefined) {
        if (Object.values(TaskStatus).includes(status as TaskStatus)) {
          task.status = {
            name: status,
            color: bgColorTaskCard[status],
          };
        } else {
          const foundStatus = await this.findStatus(status as string);
          task.status = {
            name: foundStatus.name,
            color: foundStatus.color,
          };
        }
      }
  
      await this.tasksRepository.save(task);
      return task;
  }
  
      
}
