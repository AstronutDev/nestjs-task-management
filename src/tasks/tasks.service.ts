import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto)
    }

    async getTaskById(id: number): Promise<Task> {
        const found  = await this.taskRepository.findOne(id)
        if (!found) {
            throw new NotFoundException()
        } else {
           return found
        }
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto)
    }

    async deleteTask(id: number): Promise<void> {
       const result = await this.taskRepository.delete(id)
       if (result.affected === 0) {
         throw new NotFoundException()
       }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        let task = await this.getTaskById(id)
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
