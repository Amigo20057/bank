import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { OperationsModule } from "src/operations/operations.module";
import { OperationsService } from "src/operations/operations.service";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";

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
        OperationsModule,
    ],
    controllers: [CardController],
    providers: [CardService, JwtAuthGuard, OperationsService],
    exports: [CardModule],
})
export class CardModule {}
