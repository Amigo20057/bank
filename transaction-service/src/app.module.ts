import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TransactionsModule } from "./transactions/transactions.module";

@Module({
    imports: [
        RabbitMQModule.forRoot({
            uri: "amqp://user:pass@localhost:5672",
            exchanges: [{ name: "transaction-exchange", type: "topic" }],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TransactionsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
