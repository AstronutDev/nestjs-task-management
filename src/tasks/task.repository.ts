import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status-enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto
        const query = this.createQueryBuilder('task')

        //case no-filter
        // const tasks = query.getMany()
        // return tasks

        //case filter
        if (status) {
            query.andWhere('task.status = :status', { status: status  })
        }
        
        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%`})
        }
        const tasks = query.getMany()
        return tasks
    }
 
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const {title, description } = createTaskDto
        const task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.DONE
        await task.save()

        return task
    }
}