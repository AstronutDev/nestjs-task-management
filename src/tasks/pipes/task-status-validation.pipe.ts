import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status-enum";


export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowStatuses = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ]
    
    transform(value: any) {
        console.log('value', value);

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is and invalid status`)
        }

        return value
    }

    private isStatusValid(status: any) {
        const idx = this.allowStatuses.indexOf(status)
        return idx !== -1
    }
}