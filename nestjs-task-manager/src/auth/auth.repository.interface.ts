import { User } from 'src/auth/user.entity';

export interface IAuthRepository {
    createUser(data: Partial<User>): Promise<void>;
    findUserById(id: string): Promise<User>;
    findUserByUsername(username: string): Promise<User>;
    updateUser(user: User): Promise<User>;
    deleteUser(user: User): Promise<void>;
}