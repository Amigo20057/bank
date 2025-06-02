import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const token = req.cookies?.jwt;

        if (!token) {
            throw new UnauthorizedException("No token provided");
        }

        try {
            const payload = this.jwtService.verify(token);
            req["email"] = payload.email;
            req["id"] = payload.id;
            req["token"] = token;
            return true;
        } catch (err) {
            throw new UnauthorizedException("Invalid token");
        }
    }
}
