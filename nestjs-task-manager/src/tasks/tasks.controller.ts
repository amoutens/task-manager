import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}
    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User,): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retrieving all tasks`)
        return this.tasksService.GetTasks(filterDto, user);
    }
    @Get('/:id') 
    getTaskById (@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }
    @Delete('/:id')
    deleteTaskById (@Param('id') id: string,  @GetUser() user: User) : Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }
    @Post()
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDTO, user);
    }

    @Patch('/:id')
    updateTask(@Param('id') id:string, @Body() UpdateTaskDTO: UpdateTaskDTO, @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTask(id, UpdateTaskDTO, user);
    }

} 
