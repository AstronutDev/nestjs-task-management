import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
// import * as uuid from 'uuid/v1'
import { v4 as uuidv4 } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';


@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id  === id)
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        let { title, description } = createTaskDto
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.DONE,
        }

        this.tasks.push(task)
        return task
    }

    editTask(id: string, status: TaskStatus): Task {
        let task = this.getTaskById(id)
        task.status = status
        return task
    }

    deleteTask(id: string) {
        let taskIndex = this.tasks.findIndex(task => task.id === id)
        if (!taskIndex) {
            throw new NotFoundException('not found task')
        } else {
            this.tasks.splice(taskIndex, 1)
        }
    }
}
