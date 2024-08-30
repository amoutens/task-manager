import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User)
        private usersRepo: Repository<User>, 
        private jwtService: JwtService
    ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        const user = this.usersRepo.create( {
            username,
            password: hashedPass
        })
        try{
            await this.usersRepo.save(user);
        }
        catch(error) {
            if(error.code = 23505) throw new ConflictException(`The username ${username} is already taken`)
            else throw new InternalServerErrorException();
        }
    }
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {username, password} = authCredentialsDto;
        const user = await this.usersRepo.findOne({where: {username}});

        if(user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = {username};
            const accessToken = await this.jwtService.sign(payload);
            return {accessToken}
        }
        else throw new UnauthorizedException('Login or password are incorrect')
    }
}
