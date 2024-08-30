import { User } from "./User";
import {TaskStatus} from './TaskStatus.enum'
export type Task = {
    id: string,
    title: string,
    description: string,
    status: TaskStatus ,
    user: User;
}
    