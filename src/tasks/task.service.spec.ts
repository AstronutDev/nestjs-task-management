import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { exception } from 'console'
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

    })
})