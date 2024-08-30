import { Task } from "./Task"

export type User = {
    id:string,
    username: string,
    password: string,
    tasks: Task[]
}