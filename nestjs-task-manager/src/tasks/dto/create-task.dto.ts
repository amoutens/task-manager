import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";


export class CreateTaskDTO {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsEnum(TaskStatus)
    status: TaskStatus
}