import { Status } from "src/status/status.entity";
import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column({unique: true})
    username: string;
    @Column()
    password: string;
    @OneToMany(_type => Task, task => task.user, {eager: true})
    tasks: Task[];
    @OneToMany(_type => Status, status => status.user, {eager: true})
    statuses: Status[]
}