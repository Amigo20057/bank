import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { verify } from "argon2";
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
            return false;
        }
        await this.prisma.verificationCode.delete({
            where: { email: user.email },
        });
        return true;
    }

    public async verifiedUser(userId: string): Promise<void> {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
    }

    public async changePassword(newPassword: string, oldPassword?: string) {}

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
        data: { firstName: string; lastName: string; password: string },
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isPasswordValid = await verify(user.password, data.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Incorrect password");
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
}
