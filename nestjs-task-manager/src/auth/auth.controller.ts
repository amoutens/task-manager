import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }
    @Post('/signin')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req) {
        console.log(req)
    }

    @UseGuards(AuthGuard())
    @Get('/username')
    getUser(@GetUser() user: User): User {
        return user;
    }
    @Patch('/change-password')
    @UseGuards(AuthGuard('jwt'))
    async changePassword(
        @GetUser() user: User,
        @Body('oldPassword') oldPassword: string,
        @Body('newPassword') newPassword: string,
    ): Promise<void> {
        await this.authService.changePassword(user.username, oldPassword, newPassword);
    }

    @Patch('/change-username')
    @UseGuards(AuthGuard('jwt'))
    async changeUsername(
        @GetUser() user: User,
        @Body('newUsername') newUsername: string,
    ): Promise<void> {
        await this.authService.changeUsername(user.username, newUsername);
    }

    @Delete('/delete-account')
    @UseGuards(AuthGuard('jwt'))
    async deleteAccount(@GetUser() user: User): Promise<void> {
        await this.authService.deleteAccount(user.username);
    }
}
