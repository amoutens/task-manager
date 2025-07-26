import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';

export interface ITaskRepository {
    createTask(data: Partial<Task>): Promise<Task>;
    saveTask(task: Task): Promise<Task>;
    getTasks(userId: string, filterDto: { status?: string; search?: string }): Promise<Task[]>;
    findTaskById(id: string, user: User): Promise<Task>;
    deleteTaskById(id: string, user: User): Promise<void>;
    deleteTasksByUser(user: User): Promise<void>;
}