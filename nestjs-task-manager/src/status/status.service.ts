import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStatusDTO } from "./dto/create-status.dto";
import { User } from "src/auth/user.entity";
import { Status } from "./status.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StatusRepository } from "./status.repository";
import { privateDecrypt } from "crypto";
import { IStatusRepository } from "./status.repository.interface";

@Injectable()
export class StatusService {
    constructor(
        @Inject(StatusRepository)
        private readonly statusesRepository: IStatusRepository
    ) {}
    async createStatus (createStatusDTO: CreateStatusDTO, user: User): Promise<Status> {
        const {name, color} = createStatusDTO;

        const statusData = {
            name,
            color,
            user
        };

        const status = this.statusesRepository.createStatus( statusData );
        if (!status) {
            throw new NotFoundException('Status could not be created');
        }
        return status;
    }
    async GetStatuses(user: User) : Promise<Status[]> {
        const statuses = await this.statusesRepository.getStatuses(user);
        if (!statuses || statuses.length === 0) {
            throw new NotFoundException('No statuses found for this user');
        }
        return statuses;
    }
    async deleteStatusById (id:string, user: User): Promise<void> {
        await this.statusesRepository.deleteStatusById(id, user);
    }
}