import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { GatewayController } from "./gateway.controller";
import { GatewayService } from "./gateway.service";

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.getOrThrow<string>("JWT_SECRET"),
                signOptions: { expiresIn: "1h" },
            }),
        }),
    ],
    controllers: [GatewayController],
    providers: [GatewayService],
})
export class GatewayModule {}
