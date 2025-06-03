export interface IUser {
	id?: string;
	email: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: Date;
	passportNumber: string;
	telephoneNumber: string;
	password: string;
	address: string;
	avatar?: string;
	googleId?: string;
	role: "USER" | "ADMIN";
	isVerified: boolean;
	chatId?: string;
	lastChangePassword?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserLogin {
	email?: string;
	telephoneNumber?: string;
	password: string;
}

export interface IUserRegister {
	email: string;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	passportNumber: string;
	telephoneNumber: string;
	password: string;
	address: string;
}

export interface VerificationCode {
	id?: string;
	email: string;
	code: string;
	expiresAt: Date;
}
