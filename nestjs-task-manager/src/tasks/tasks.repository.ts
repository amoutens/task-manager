import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { ITaskRepository } from './tasks.repository.interface';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(Task)
        private readonly repo: Repository<Task>
    ) {}
    async saveTask(task: Task): Promise<Task> {
        return await this.repo.save(task);
    }
    async createTask(data: Partial<Task>): Promise<Task> {
        const task = this.repo.create(data);
        return await this.saveTask(task);
    }

    async getTasks(userId: string, filterDto: { status?: string; search?: string }): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.repo.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId });

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
        return await query.getMany();
    }
    async findTaskById(id: string, user: User): Promise<Task> {
        const task = await this.repo.findOne({ where: { id, user: { id: user.id } } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }
    async deleteTaskById(id: string, user: User): Promise<void> {
        const found = await this.repo.delete({ id, user });
        if (found.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
    async deleteTasksByUser(user: User): Promise<void> {
        await this.repo.delete({ user });
    }
}