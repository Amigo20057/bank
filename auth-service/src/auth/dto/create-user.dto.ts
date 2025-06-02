import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    MinLength,
} from "class-validator";

export class CreateUserDto {
    id?: string;

    @IsEmail()
    email: string;

    @IsString({ message: "Ім'я має бути рядком." })
    @IsNotEmpty({ message: "Ім'я є обов'язковим для заповнення." })
    firstName: string;

    @IsString({ message: "Прізвище має бути рядком." })
    @IsNotEmpty({ message: "Прізвище є обов'язковим для заповнення." })
    lastName: string;

    dateOfBirth: Date;

    @IsString({ message: "Номер паспорта має бути рядком." })
    @IsNotEmpty({ message: "Номер паспорта є обов'язковим для заповнення." })
    @Length(6, 6, { message: "Паспортний номер має складатися з 6 цифр" })
    passportNumber: string;

    @IsString({ message: "Пароль має бути рядком." })
    @IsNotEmpty({ message: "Пароль є обов'язковим для заповнення." })
    @MinLength(5, {
        message: "Пароль має містити щонайменше 5 символів.",
    })
    password: string;

    @IsString({ message: "Номер телефону має бути рядком." })
    @IsNotEmpty({ message: "Номер телефону є обов'язковим для заповнення." })
    telephoneNumber: string;

    @IsString()
    address: string;

    avatar?: string;
    isVerified?: boolean;
    googleId?: string;
}
