import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])/, {
        message: 'password must contain at least one lowercase letter.',
    })
    @Matches(/^(?=.*[A-Z])/, {
        message: 'password must contain at least one uppercase letter.',
    })
    @Matches(/^(?=.*\d)/, {
        message: 'password must contain at least one number.',
    })
    password: string;
}