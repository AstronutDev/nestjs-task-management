// import { User } from "src/auth/user.entity";
import { User } from "../auth/user.entity"
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status-enum";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    status: TaskStatus 

    @Column()
    userId: number
    @ManyToOne(type => User, task => task.tasks)
    @JoinColumn({ name: 'userId'})
    user: User
}