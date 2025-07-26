import { User } from 'src/auth/user.entity';
import { Status } from './status.entity';

export interface IStatusRepository {
    createStatus(data: Partial<Status>): Promise<Status>;
    getStatuses(user: User): Promise<Status[]>;
    deleteStatusById(id: string, user: User): Promise<void>;
    findStatus(name: string): Promise<Status>;
    deleteStatusesByUser(user: User): Promise<void>;
}