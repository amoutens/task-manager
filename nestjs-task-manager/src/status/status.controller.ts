import { StatusService } from './status.service';
import { Body, Controller, Delete, Get, Logger, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateStatusDTO } from "./dto/create-status.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";
import { Status } from "./status.entity";

@Controller('status')
@UseGuards(AuthGuard())
export class StatusController {
    
    constructor(private statusService: StatusService) {}
    private logger = new Logger('TasksController');
    @Post()
    createStatus(
        @Body() createStatusDTO: CreateStatusDTO,
        @GetUser() user: User,
    ): Promise<Status> {
        return this.statusService.createStatus(createStatusDTO, user);
    }
    @Get()
    getTasks( @GetUser() user: User,): Promise<Status[]> {
    this.logger.verbose(`User ${user.username} retrieving all statuses`)
        return this.statusService.GetStatuses(user);
    }
    @Delete('/:id')
    deleteTaskById (@Param('id') id: string,  @GetUser() user: User) : Promise<void> {
        return this.statusService.deleteStatusById(id, user);
    }
}