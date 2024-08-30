import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus;
    @IsNotEmpty()
    @IsOptional()
    search: string;
}