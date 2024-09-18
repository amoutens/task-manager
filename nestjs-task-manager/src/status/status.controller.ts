import { StatusService } from './status.service';
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateStatusDTO } from "./dto/create-status.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";
import { Status } from "./status.entity";

@Controller('status')
@UseGuards(AuthGuard())
export class StatusController {
    constructor(private statusService: StatusService) {}
    @Post()
    createStatus(
        @Body() createStatusDTO: CreateStatusDTO,
        @GetUser() user: User,
    ): Promise<Status> {
        return this.statusService.createStatus(createStatusDTO, user);
    }
}