import { Status } from './status.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStatusRepository } from './status.repository.interface';
import { User } from 'src/auth/user.entity';

@Injectable()
export class StatusRepository implements IStatusRepository {
    constructor(
        @InjectRepository(Status)
        private readonly repo: Repository<Status>
    ) {}

    async createStatus(data: Partial<Status>): Promise<Status> {
        const status = this.repo.create(data);
        return await this.repo.save(status);
    }

    async getStatuses(user: User): Promise<Status[]> {
        const query = this.repo.createQueryBuilder('status');
        query.where({ user });
        return await query.getMany();
    }
    
    async deleteStatusById(id: string, user: User): Promise<void> {
        const found = await this.repo.delete({ id, user });
        if (found.affected === 0) {
            throw new NotFoundException(`Status with ID "${id}" not found`);
        }
    }
    async findStatus(name: string): Promise<Status> {
        const status = await this.repo.findOne({ where: { name } });
        if (!status) {
            throw new NotFoundException(`Status with name "${name}" not found`);
        }
        return status;
    }
    async deleteStatusesByUser(user: User): Promise<void> {
        await this.repo.delete({ user });
    }
}