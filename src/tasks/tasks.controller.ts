import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    // @Get()
    // getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
    //     if(Object.keys(filterDto).length) {
    //         return this.taskService.getTaskWithFilter(filterDto)
    //     } else {
    //         return this.taskService.getAllTasks()
    //     }
    // }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return  this.taskService.createTask(createTaskDto)
    }

    // @Patch('/:id')
    // editTask(
    //     @Param('id') id: string,
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus
    // ): Task {
    //     return this.taskService.editTask(id, status)
    // }

    // @Delete('/:id')
    // deleteTaskById(@Param('id') id: string) {
    //     this.taskService.deleteTask(id)
    //     return {
    //         'message': 'delete success'
    //     }
    // }
}
