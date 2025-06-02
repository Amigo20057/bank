import { status } from "@grpc/grpc-js";
import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash, verify } from "argon2";
import { Request, Response } from "express";
import Redis from "ioredis";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserClientService } from "./user.client";

@Injectable()
export class AuthService {
    public constructor(
        private readonly userClient: UserClientService,
        private readonly jwtService: JwtService,
        @Inject("REDIS_CLIENT") private readonly redisClient: Redis,
    ) {}

    public async register(
        dto: CreateUserDto,
    ): Promise<Record<string, any> & { token: string }> {
        let userExists = null;
        try {
            userExists = await this.userClient.GetUserByEmail(dto.email);
        } catch (error) {
            if (error.code === status.NOT_FOUND) {
                // це ок, юзера нема
            } else {
                throw new BadRequestException("gRPC error: " + error.message);
            }
        }

        if (userExists) {
            throw new BadRequestException("User already exists");
        }

        dto.password = await hash(dto.password);
        const user = await this.userClient.createUser(dto);
        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
        });
        await this.redisClient.set(token, JSON.stringify(user), "EX", 60 * 15);
        return {
            user: user,
            token,
        };
    }

    public async login(
        email: string,
        password: string,
    ): Promise<Record<string, any> & { token: string }> {
        let userExists = null;
        try {
            userExists = await this.userClient.GetUserByEmail(email);
        } catch (error) {
            if (error.code !== status.NOT_FOUND) {
                // юзер є
            } else {
                throw new BadRequestException("gRPC error: " + error.message);
            }
        }
        if (!userExists) {
            throw new BadRequestException("User not exists");
        }
        const validPass = await verify(userExists.password, password);
        if (!validPass) {
            throw new UnauthorizedException("Wrong data");
        }
        const token = this.jwtService.sign({
            id: userExists.id,
            email: userExists.email,
        });
        await this.redisClient.set(
            token,
            JSON.stringify(userExists),
            "EX",
            60 * 15,
        );
        return {
            user: userExists,
            token,
        };
    }

    public async logout(req: Request, res: Response): Promise<void> {
        const token = req.cookies["jwt"];
        if (token) {
            await this.redisClient.del(token);
        }
        res.clearCookie("jwt");
    }

    public generateToken(user: any): string {
        return this.jwtService.sign({
            id: user.id,
            email: user.email,
        });
    }

    public async saveSessionToRedis(token: string, user: any): Promise<void> {
        await this.redisClient.set(token, JSON.stringify(user), "EX", 60 * 15);
    }
}
