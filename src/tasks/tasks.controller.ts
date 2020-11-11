import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service'
import { Task, TaskStatus } from './task.model'
import { CreateTaskDto} from './dto/create-task.dto'
import { title } from 'process';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getAllTasks() {
        return this.taskService.getAllTasks()
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string) {
        return this.taskService.getTaskById(id)
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return  this.taskService.createTask(createTaskDto)
    }

    @Patch('/:id')
    editTask(
        @Param('id') id: string,
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('status') status: TaskStatus
    ): Task {
        return this.taskService.editTask(id, status)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string) {
        this.taskService.deleteTask(id)
        return {
            'message': 'delete success'
        }
    }
}
