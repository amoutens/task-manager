import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
    // @IsEnum(TaskStatus)
    @IsNotEmpty()
    @IsOptional()
    status: TaskStatus | string; ;
    @IsNotEmpty()
    @IsOptional()
    search: string;
}