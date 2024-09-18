import { Injectable } from "@nestjs/common";
import { CreateStatusDTO } from "./dto/create-status.dto";
import { User } from "src/auth/user.entity";
import { Status } from "./status.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(Status)
        private statusesRepository: Repository<Status>,
      ) {}
    async createStatus (createStatusDTO: CreateStatusDTO, user: User): Promise<Status> {
        const {name, color} = createStatusDTO;

        const status = this.statusesRepository.create( {
            name,
            color,
            user
        })
        await this.statusesRepository.save(status);
        return status;
    }
}