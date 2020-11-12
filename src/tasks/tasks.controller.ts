import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service'
import { Task, TaskStatus } from './task.model'
import { CreateTaskDto} from './dto/create-task.dto'
import { GetTaskFilterDto } from './dto/get-task-filter.dtio';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
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
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return  this.taskService.createTask(createTaskDto)
    }

    @Patch('/:id')
    editTask(
        @Param('id') id: string,
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
