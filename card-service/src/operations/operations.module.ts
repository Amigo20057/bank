import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CardService } from "src/card/card.service";
import { OperationsController } from "./operations.controller";
import { OperationsService } from "./operations.service";
import { TransactionClientService } from "./transaction.client";

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
    controllers: [OperationsController],
    providers: [OperationsService, TransactionClientService, CardService],
    exports: [OperationsModule, TransactionClientService],
})
export class OperationsModule {}
