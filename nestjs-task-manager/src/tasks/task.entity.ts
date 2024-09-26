import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { User } from "src/auth/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;
    @Column()
    description: string;
    // @Column()
    // status: Object;
    @Column('json', { nullable: true })
status: { name: string | TaskStatus; color: string } | null;
    @ManyToOne(_type => User, user => user.tasks, {eager: false})
    @Exclude({toPlainOnly: true})
    user: User;
}