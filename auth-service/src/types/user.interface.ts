export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    telephoneNumber: string;
    password: string;
    address: string;
    avatar?: string;
    googleId?: string;
    role: "ADMIN" | "USER";
    isVerified: boolean;
    chatId?: string;
    lastChangePassword: string;
}
