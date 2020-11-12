import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service'
import { Task, TaskStatus } from './task.model'
import { CreateTaskDto} from './dto/create-task.dto'
import { GetTaskFilterDto } from './dto/get-task-filter.dtio';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
        if(Object.keys(filterDto).length) {
            return this.taskService.getTaskWithFilter(filterDto)
        } else {
            return this.taskService.getAllTasks()
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string) {
        return this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return  this.taskService.createTask(createTaskDto)
    }

    @Patch('/:id')
    editTask(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
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
