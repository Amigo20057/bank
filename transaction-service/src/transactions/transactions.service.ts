import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionsService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    public async createTransaction(dto: CreateTransactionDto) {
        const transaction = await this.prismaService.transactions.create({
            data: {
                amount: dto.amount,
                receivedCardNumber: dto.receivedCardNumber,
                senderCardNumber: dto.senderCardNumber,
                type: dto.transactionType,
                valuta: dto.valuta,
            },
        });

        await this.amqpConnection.publish(
            "transaction-exchange",
            "transaction.created",
            {
                receivedCardNumber: transaction.receivedCardNumber,
                senderCardNumber: transaction.senderCardNumber,
                amount: transaction.amount,
                valuta: transaction.valuta,
                type: transaction.type,
                timestamp: new Date().toISOString(),
            },
        );

        return transaction;
    }
}
