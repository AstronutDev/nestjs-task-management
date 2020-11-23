import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { exception } from 'console'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTaskFilterDto } from './dto/get-task-filter.dto'
import { TaskStatus } from './task-status-enum'
import { TaskRepository } from './task.repository'
import { TasksService } from "./tasks.service"

const mockUser = {
    id: 1,
    username: 'test_user1',
}

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
})

describe('taskService', () => {
    let taskService
    let taskRepository
  
    beforeEach(async () => {
        const module =  await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile()

        taskService = await module.get<TasksService>(TasksService)
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    }) 

    describe('getTasks', () => {
        it('getAllTaskFromRepository', () => {
            expect(taskRepository.getTasks).not.toHaveBeenCalled()

             //create filterDto
            const filter: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'some search query'}

            //call taskService.getTasks
            taskService.getTasks(filter, mockUser)

            //expect taskRepository.getTasks TO HAVE BEEN CALLED 
            expect(taskRepository.getTasks).toHaveBeenCalled()
        })
    })

    describe('getTaskById',() => {
        it('calls taskRepository .findOne() and success retrieve and return the task', async () => {
            const mockTask = { title: 'title Task', description: 'description task'}
            taskRepository.findOne.mockResolvedValue(mockTask )  

            const result = await taskService.getTaskById(1, mockUser)
            expect(result).toEqual(mockTask)

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                     id: 1,
                     userId: mockUser.id}
            } )
        })

        it('throw error the task not found ', () => {
            taskRepository.findOne.mockResolvedValue(null)
            expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask', () => {
        it('call create taskRepository and return result', async () => {
            taskRepository.createTask.mockResolvedValue('some task')

            const taskDto: CreateTaskDto = { title: 'coding', description: '3hr'}
            expect(taskRepository.createTask).not.toHaveBeenCalled()
            
            const result = await taskService.createTask(taskDto, mockUser)
            expect(taskRepository.createTask).toHaveBeenCalledWith(taskDto, mockUser)

            expect(result).toEqual('some task')
        })
    })

    describe('deletTask', () => {
        it('call delete taskService and return string', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1})
            expect(taskRepository.delete).not.toHaveBeenCalled()
            await taskService.deleteTask(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalledWith({ id:1, userId: mockUser.id})
        })

        it('throw error the task not found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0})
            expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('updateTask', () => {
        const save = jest.fn().mockResolvedValue(true)

        it('call update taskService', async() => {
            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            })

            expect(taskService.getTaskById).not.toHaveBeenCalled()
            expect(save).not.toHaveBeenCalled()

            const result = await taskService.updateTaskStatus(1, TaskStatus.OPEN, mockUser)
            expect(taskService.getTaskById).toHaveBeenCalled()
            expect(save).toHaveBeenCalled()

            expect(result.status).toEqual(TaskStatus.OPEN)
        })
    })
})