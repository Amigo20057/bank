import { status } from "@grpc/grpc-js";
import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { Request } from "express";
import { User } from "prisma/__generate__";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { sendVerificationEmail } from "./providers/email/email";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @GrpcMethod("UserService", "CreateUser")
    public async createUser(@Body() dto: CreateUserDto): Promise<User> {
        try {
            const user = await this.userService.createUser(dto);
            return user;
        } catch (error) {
            console.error("GRPC CreateUser Error:", error);
            throw new RpcException("Ошибка создания пользователя");
        }
    }

    @GrpcMethod("UserService", "GetUserByEmail")
    public async getUserByEmail(data: { email: string }): Promise<User> {
        const user = await this.userService.findUserByEmail(data.email);
        if (!user) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: "User not found",
            });
        }
        return user;
    }

    @Get("/profile")
    @UseGuards(JwtAuthGuard)
    public async profile(@Req() req: Request) {
        return await this.userService.profile(req["token"], req["email"]);
    }

    @Post("/request-verification")
    @UseGuards(JwtAuthGuard)
    public async requestVErification(@Req() req: Request) {
        const { email } = req.body;
        const code = await this.userService.generateCode(email);
        await sendVerificationEmail(email, code);
        return { success: true };
    }

    @Post("/verify-account")
    @UseGuards(JwtAuthGuard)
    public async verifyAccount(@Req() req: Request) {
        const { code } = req.body;
        const isValid = await this.userService.verifyCode(req["id"], code);
        if (!isValid) {
            return false;
        }
        await this.userService.verifiedUser(req["id"], req["token"]);
        return { success: true };
    }

    @Patch("/change-full-name")
    @UseGuards(JwtAuthGuard)
    public async changeFullName(
        @Req() req: Request,
        @Body() data: { firstName: string; lastName: string; password: string },
    ) {
        console.log(data);
        return this.userService.changeFullName(
            req["email"],
            req["token"],
            data,
        );
    }

    @Patch("/change-phone-number")
    @UseGuards(JwtAuthGuard)
    public async changePhoneNumber(
        @Req() req: Request,
        @Body() data: { newPhoneNumber: string; password: string },
    ) {
        return this.userService.changePhoneNumber(
            req["email"],
            req["token"],
            data,
        );
    }

    @Patch("/change-address")
    @UseGuards(JwtAuthGuard)
    public async changeAddress(
        @Req() req: Request,
        @Body() data: { newAddress: string; password: string },
    ) {
        return this.userService.changeAddress(req["email"], req["token"], data);
    }

    @Patch("/change-email")
    @UseGuards(JwtAuthGuard)
    public async changeEmail(
        @Req() req: Request,
        @Body() data: { newEmail: string; password: string },
    ) {
        return this.userService.changeEmail(req["email"], req["token"], data);
    }

    @Patch("/change-passport-number")
    @UseGuards(JwtAuthGuard)
    public async changePassportNumber(
        @Req() req: Request,
        @Body() data: { newPassportNumber: string; password: string },
    ) {
        return this.userService.changePassportNumber(
            req["email"],
            req["token"],
            data,
        );
    }

    @Patch("/change-password")
    @UseGuards(JwtAuthGuard)
    public async changePassword(
        @Req() req: Request,
        @Body() data: { oldPassword: string; newPassword: string },
    ) {
        return this.userService.changePassword(
            req["email"],
            req["token"],
            data,
        );
    }

    @Patch("/change-date-of-birth")
    @UseGuards(JwtAuthGuard)
    public async changeDateOfBirth(
        @Req() req: Request,
        @Body() data: { newDate: Date; password: string },
    ) {
        return this.userService.changeDateOfBirth(
            req["email"],
            req["token"],
            data,
        );
    }
}
