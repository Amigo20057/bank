import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CardModule } from "./card/card.module";
import { PrismaModule } from "./prisma/prisma.module";
import { OperationsModule } from './operations/operations.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CardModule,
        PrismaModule,
        OperationsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
