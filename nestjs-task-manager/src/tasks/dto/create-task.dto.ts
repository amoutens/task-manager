import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";
import { Status } from "src/status/status.entity";


export class CreateTaskDTO {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    // // @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus | string;
    
}