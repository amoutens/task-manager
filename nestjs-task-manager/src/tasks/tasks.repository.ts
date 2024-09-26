// import { Repository } from 'typeorm';
// import { Task } from './task.entity';
// import { CreateTaskDTO } from './dto/create-task.dto';
// import { TaskStatus } from './task-status.enum';

// export class TasksRepository extends Repository<Task> {
//     async createTask (createTaskDTO: CreateTaskDTO): Promise<Task> {
//         const {title, description} = createTaskDTO
//         const task = this.create( {
//             title,
//             description,
//             status: TaskStatus.OPEN,
//         })
//         await this.save(task);
//         return task;
//     }
// }
