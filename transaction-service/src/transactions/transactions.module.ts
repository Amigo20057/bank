import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
    imports: [
        RabbitMQModule.forRoot({
            uri: "amqp://user:pass@localhost:5672",
            exchanges: [{ name: "transaction-exchange", type: "topic" }],
        }),
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
