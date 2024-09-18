import { Injectable, NotFoundException } from '@nestjs/common';
import {TaskStatus} from './task-status.enum'
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { error } from 'console';
import { TasksRepository } from './tasks.repository';
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

      async GetTasks(filterDto: GetTasksFilterDto, user: User) : Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.tasksRepository.createQueryBuilder('task');
        query.where({user});
        if(status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
              );
            }
        const tasks = await query.getMany();
        return tasks;
        }
    async createTask (createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const {title, description, status} = createTaskDTO;

        let taskStatus: string | Status;
        if ( Object.values(TaskStatus).includes(status as TaskStatus)) {
            taskStatus = status as TaskStatus;
        }
        else {
            const foundStatus = await this.findStatus(status as string);
            taskStatus = foundStatus.name;
        }
        const task = this.tasksRepository.create( {
            title,
            description,
            status: taskStatus,
            user
        })
        await this.tasksRepository.save(task);
        return task;
    }
    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({where: {id, user}});
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
        const task = await this.getTaskById(id, user);
        const { title, description, status } = updateTaskDTO;
        
        if (title !== undefined) {
            task.title = title;
        }
        if (description !== undefined) {
            task.description = description;
        }
        if (status !== undefined) {
            if (status !== undefined) {
                let taskStatus: string | Status;
                if (Object.values(TaskStatus).includes(status as TaskStatus)) {
                  taskStatus = status as TaskStatus;
                } else {
                  const foundStatus = await this.findStatus(status as string);
                  taskStatus = foundStatus.name;
                }
          
                task.status = taskStatus;
              }
        }
        await this.tasksRepository.save(task);
        return task;
    }
}
