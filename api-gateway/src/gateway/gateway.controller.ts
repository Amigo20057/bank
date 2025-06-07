import { HttpService } from "@nestjs/axios";
import {
    All,
    Controller,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { GatewayService } from "./gateway.service";

@Controller()
export class GatewayController {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService,
    ) {}

    @All("*")
    async proxy(@Req() req: Request, @Res() res: Response) {
        try {
            const publicPaths = [
                "/auth/login",
                "/auth/register",
                "/auth/google/callback",
                "/auth/google",
            ];

            const isPublic = publicPaths.includes(req.url);

            if (!isPublic) {
                const token = req.cookies?.jwt;
                if (!token) throw new UnauthorizedException("Token not found");
                this.jwtService.verify(token);
            }

            let targetUrl = "";

            if (req.url.startsWith("/auth")) {
                targetUrl = "http://185.25.117.206:5000" + req.url;
            } else if (req.url.startsWith("/user")) {
                targetUrl = "http://185.25.117.206:4000" + req.url;
            } else if (req.url.startsWith("/card")) {
                targetUrl = "http://185.25.117.206:6000" + req.url;
            } else if (req.url.startsWith("/transactions")) {
                targetUrl = "http://185.25.117.206:7001" + req.url;
            } else {
                return res.status(404).send("Service not found");
            }

            const response = await this.httpService.axiosRef.request({
                method: req.method,
                url: targetUrl,
                data: req.body,
                headers: {
                    cookie: req.headers.cookie,
                },
                withCredentials: true,
            });

            const setCookie = response.headers["set-cookie"];
            if (setCookie) {
                res.setHeader("Set-Cookie", setCookie);
            }

            return res.status(response.status).send(response.data);
        } catch (err) {
            const status = err.response?.status || 500;
            const data = err.response?.data || {
                message: err.message || "Internal Server Error",
            };

            return res.status(status).json(data);
        }
    }
}
