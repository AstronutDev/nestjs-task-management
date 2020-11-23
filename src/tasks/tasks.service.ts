import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user)
    }

    async getTaskById(
        id: number,
        user: User
    ): Promise<Task> {
        const found  = await this.taskRepository.findOne( {where: { id, userId: user.id}} )
        if (!found) {
            throw new NotFoundException()
        } else {
           return found
        }
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Object> {
        return this.taskRepository.createTask(createTaskDto, user)
    }

    async deleteTask(
        id: number,
        user: User
    ): Promise<Object> {
       const result = await this.taskRepository.delete({ id, user})
       if (result.affected === 0) {
         throw new NotFoundException()
       }

       return {
           status: 'success'
       }
    }

    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        let task = await this.getTaskById(id, user)
        task.status = status
        await task.save()
        return task
    }

    //  getAllTasks(): Task[] {
    //     return this.tasks
    // }

    // getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
    //     const {status, search} = filterDto
    //     let tasks = this.getAllTasks()

    //     if (status) {
    //         tasks = tasks.filter(task => task.status == status)
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         )
    //     }
    //     return tasks
    // }
}
