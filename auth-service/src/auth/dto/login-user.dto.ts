import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserLoginDto {
    @IsEmail()
    email: string;

    @IsString({ message: "Пароль має бути рядком." })
    @IsNotEmpty({ message: "Пароль є обов'язковим для заповнення." })
    @MinLength(5, {
        message: "Пароль має містити щонайменше 5 символів.",
    })
    password: string;
}
