import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/auth/user.entity";
import { Exclude } from "class-transformer";
import { TaskStatus } from "src/tasks/task-status.enum";

@Entity()
export class Status {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column()
    color: string;
    @ManyToOne(_type => User, user => user.statuses, {eager: false})
    @Exclude({toPlainOnly: true})
    user: User;
}