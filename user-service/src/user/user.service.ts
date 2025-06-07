import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { hash, verify } from "argon2";
import { randomInt } from "crypto";
import Redis from "ioredis";
import { User } from "prisma/__generate__";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    public constructor(
        private readonly prisma: PrismaService,
        @Inject("REDIS_CLIENT") private readonly redisClient: Redis,
    ) {}

    public async createUser(dto: CreateUserDto): Promise<User> {
        let dateOfBirth: Date | null = null;
        if (dto.dateOfBirth) {
            const parsed = new Date(dto.dateOfBirth);
            if (!isNaN(parsed.getTime())) {
                dateOfBirth = parsed;
            } else {
                console.warn("Некорректная дата рождения:", dto.dateOfBirth);
            }
        }

        return this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                dateOfBirth,
                passportNumber: dto.passportNumber,
                password: dto.password,
                address: dto.address,
                avatar: dto.avatar || null,
                isVerified: dto.isVerified || false,
                googleId: dto.googleId || null,
                telephoneNumber: dto.telephoneNumber,
            },
        });
    }

    public async findUserById(id: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    public async findUserByEmail(email: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    public async profile(token: string, email?: string): Promise<User | null> {
        const payload = await this.redisClient.get(token);
        if (payload) {
            const user: User = JSON.parse(payload);
            console.log("USER IN REDIS: ", user);
            await this.redisClient.set(
                token,
                JSON.stringify(user),
                "EX",
                60 * 15,
            );
            return user;
        }
        if (!email) {
            console.log("Email not provided when Redis is empty");
            return null;
        }
        const user = await this.findUserByEmail(email);
        if (user) {
            console.log("USER IN DATABASE: ", user);
            await this.redisClient.set(
                token,
                JSON.stringify(user),
                "EX",
                60 * 15,
            );
        }
        return user;
    }

    public async generateCode(email: string): Promise<string> {
        if (!email) {
            throw new BadRequestException("Email is required");
        }
        const code = randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.verificationCode.deleteMany({
            where: {
                email,
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        await this.prisma.verificationCode.create({
            data: {
                email,
                code,
                expiresAt,
            },
        });
        return code;
    }

    public async verifyCode(userId: string, code: string): Promise<boolean> {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const record = await this.prisma.verificationCode.findFirst({
            where: {
                email: user.email,
                code: code,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!record || record.code !== code || record.expiresAt < new Date()) {
            throw new BadRequestException("Invalid Code");
        }
        await this.prisma.verificationCode.delete({
            where: { email: user.email },
        });
        return true;
    }

    public async verifiedUser(userId: string, token: string): Promise<void> {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
        const updatedUser = await this.findUserById(userId);
        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async resetPassword(email: string, code: string): Promise<boolean> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException("Wrong data");
        }
        const record = await this.prisma.verificationCode.findFirst({
            where: {
                email: user.email,
                code: code,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!record || record.code !== code || record.expiresAt < new Date()) {
            return false;
        }
        await this.prisma.verificationCode.delete({
            where: { email: user.email },
        });
        return true;
    }

    public async changeFullName(
        email: string,
        token: string,
        data: { firstName: string; lastName: string; password?: string },
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (!user.googleId) {
            if (!data.password) {
                throw new UnauthorizedException("Password is required");
            }

            const isPasswordValid = await verify(user.password, data.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException("Incorrect password");
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async changePhoneNumber(
        email: string,
        token: string,
        data: { newPhoneNumber: string; password?: string },
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (!user.googleId) {
            if (!data.password) {
                throw new UnauthorizedException("Password is required");
            }

            const isPasswordValid = await verify(user.password, data.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException("Incorrect password");
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                telephoneNumber: data.newPhoneNumber,
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async changeAddress(
        email: string,
        token: string,
        data: { newAddress: string; password?: string },
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Якщо акаунт НЕ через Google — перевірка пароля обов'язкова
        if (!user.googleId) {
            if (!data.password) {
                throw new UnauthorizedException("Password is required");
            }

            const isPasswordValid = await verify(user.password, data.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException("Incorrect password");
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                address: data.newAddress,
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async changeEmail(
        email: string,
        token: string,
        data: { newEmail: string; password: string },
    ) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        const findUserWithNewEmail = await this.prisma.user.findUnique({
            where: { email: data.newEmail },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (findUserWithNewEmail) {
            throw new BadRequestException("User with new email exists");
        }

        const isPasswordValid = await verify(user.password, data.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Incorrect password");
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                email: data.newEmail,
                isVerified: false,
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async changePassportNumber(
        email: string,
        token: string,
        data: { newPassportNumber: string; password?: string },
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const existingUser = await this.prisma.user.findFirst({
            where: { passportNumber: data.newPassportNumber },
        });

        if (existingUser) {
            throw new BadRequestException(
                "User with this passport number already exists",
            );
        }

        if (!user.googleId) {
            if (!data.password) {
                throw new UnauthorizedException("Password is required");
            }

            const isPasswordValid = await verify(user.password, data.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException("Incorrect password");
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                passportNumber: data.newPassportNumber,
                isVerified: false,
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async changePassword(
        email: string,
        token: string,
        data: { oldPassword: string; newPassword: string },
    ) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isPasswordValid = await verify(user.password, data.oldPassword);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Incorrect password");
        }

        const hashPassword = await hash(data.newPassword);

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                password: hashPassword,
                lastChangePassword: new Date(),
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }

    public async changeDateOfBirth(
        email: string,
        token: string,
        data: { newDate: Date; password?: string },
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const parsedDate = new Date(data.newDate);
        if (isNaN(parsedDate.getTime())) {
            throw new BadRequestException("Invalid date format");
        }

        if (!user.googleId) {
            if (!data.password) {
                throw new UnauthorizedException("Password is required");
            }

            const isPasswordValid = await verify(user.password, data.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException("Incorrect password");
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                dateOfBirth: parsedDate,
            },
        });

        await this.redisClient.set(
            token,
            JSON.stringify(updatedUser),
            "EX",
            60 * 15,
        );
    }
}
