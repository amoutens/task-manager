import { Repository } from "typeorm";
import { User } from "./user.entity";
import { IAuthRepository } from "./auth.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Inject, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TaskRepository } from "src/tasks/tasks.repository";
import { ITaskRepository } from "src/tasks/tasks.repository.interface";
import { StatusRepository } from "src/status/status.repository";
import { IStatusRepository } from "src/status/status.repository.interface";

export class AuthRepository implements IAuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @Inject(TaskRepository)
        private readonly tasksRepo: ITaskRepository,
        @Inject(StatusRepository)
        private readonly statRepo: IStatusRepository
    ) {}

    async createUser(userData: Partial<User>): Promise<void> {
        const user = this.userRepo.create({ ...userData });

        try {
            await this.userRepo.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException({
                    statusCode: 409,
                    message: [`The username ${userData.username} is already taken.`],
                });
            } else {
                throw new InternalServerErrorException({
                    statusCode: 500,
                    message: 'Internal server error',
                });
            }
        }
    }

    async findUserById(id: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    async findUserByUsername(username: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException(`User with username "${username}" not found`);
        }
        return user;
    }
    
    async updateUser(user: User): Promise<User> {
      return this.userRepo.save(user);
    }

    async deleteUser(user: User): Promise<void> {
      await this.tasksRepo.deleteTasksByUser(user); 
      await this.statRepo.deleteStatusesByUser(user); 
      await this.userRepo.remove(user); 
    }
}