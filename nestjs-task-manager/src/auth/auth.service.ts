import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { validateOrReject } from 'class-validator';
import { Task } from 'src/tasks/task.entity';
import { Status } from 'src/status/status.entity';
import { AuthRepository } from './users.repository';
import { IAuthRepository } from './auth.repository.interface';

@Injectable()
export class AuthService {
    constructor (
        @Inject(AuthRepository)
        private readonly usersRepo: IAuthRepository, 
        private jwtService: JwtService
    ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        
        try {
            await validateOrReject(authCredentialsDto);
        } catch (validationErrors) {
            const formattedErrors = validationErrors.flatMap((err) => 
                Object.values(err.constraints ?? {})
            );
            throw new BadRequestException({
                statusCode: 400,
                message: formattedErrors,
            });
        }

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        const userData = {
            username,
            password: hashedPass,
        }
        await this.usersRepo.createUser(userData);
    }
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {username, password} = authCredentialsDto;
        const user = await this.usersRepo.findUserByUsername(username);

        if(user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = {username};
            const accessToken = await this.jwtService.sign(payload);
            return {accessToken}
        }
        else throw new UnauthorizedException('Login or password are incorrect')
    }
    async getUserByUsername(username: string): Promise<User> {
        return this.usersRepo.findUserByUsername(username);
    }
    
    async changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserByUsername(username);

    if (!user) {
        throw new UnauthorizedException('User not found');
    }

    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
        throw new UnauthorizedException('Old password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(newPassword, salt);
    user.password = hashedPass;

    try {
        await this.usersRepo.updateUser(user);
    } catch (error) {
        throw new InternalServerErrorException('Could not update the password');
    }
}

    async changeUsername(currentUsername: string, newUsername: string): Promise<void> {
        const user = await this.getUserByUsername(currentUsername);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const existingUser = await this.usersRepo.findUserByUsername(newUsername);
        if (existingUser) {
            throw new ConflictException('Username is already taken');
        }

        user.username = newUsername;

        try {
            await this.usersRepo.updateUser(user);
        } catch (error) {
            throw new InternalServerErrorException('Could not update the username');
        }
    }

    async deleteAccount(username: string): Promise<void> {
        const user = await this.getUserByUsername(username);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        try {
            await this.usersRepo.deleteUser( user );
        } catch (error) {
            throw new InternalServerErrorException('Could not delete account and related tasks');
        }
    }
}
