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

@Injectable()

export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        @InjectRepository(TasksRepository)
        private tasksRepo: TasksRepository,
      ) {}
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

        const task = this.tasksRepository.create( {
            title,
            description,
            status,
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
            task.status = status;
        }
        await this.tasksRepository.save(task);
        return task;
    }
}
