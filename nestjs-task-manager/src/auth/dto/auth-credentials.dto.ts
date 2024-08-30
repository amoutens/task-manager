import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d].*$/,
         {message: 'password is weak'})
    password: string;
}