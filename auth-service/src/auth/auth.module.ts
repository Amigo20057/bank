import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RedisProvider } from "src/redis/redis.provider";
import { JwtStrategy } from "src/strategy/jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./providers/google/google.strategy";
import { UserClientService } from "./user.client";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                global: true,
                secret: config.getOrThrow<string>("JWT_SECRET"),
                signOptions: { expiresIn: "1h" },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserClientService,
        JwtStrategy,
        RedisProvider,
        GoogleStrategy,
    ],
})
export class AuthModule {}
