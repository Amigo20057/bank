import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { IUser } from "../types/user.interface";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserLoginDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("google")
    @UseGuards(AuthGuard("google"))
    googleAuth() {}

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthCallback(
        @Req() req: Request & { user: IUser },
        @Res() res: Response,
    ) {
        console.log("Callback triggered, user:", req.user);
        const user = req.user;
        const token = this.authService.generateToken(user);
        await this.authService.saveSessionToRedis(token, user);

        res.cookie("jwt", token, { httpOnly: true, sameSite: "lax" });
        return res.redirect("http://localhost:5173");
    }

    @Post("/register")
    @HttpCode(HttpStatus.OK)
    async register(@Body() dto: CreateUserDto, @Res() res: Response) {
        const { user, token } = await this.authService.register(dto);
        res.cookie("jwt", token, { httpOnly: true, sameSite: "lax" });
        res.send({ user: user });
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: UserLoginDto, @Res() res: Response) {
        const { user, token } = await this.authService.login(
            dto.email,
            dto.password,
        );
        res.cookie("jwt", token, { httpOnly: true, sameSite: "lax" });
        res.send({ user: user });
    }

    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res() res: Response) {
        console.log("Request: ", req);
        await this.authService.logout(req, res);
        res.send({ message: "Logged out successfully" });
    }
}
