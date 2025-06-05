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
                recipientCardNumber: dto.recipientCardNumber,
                senderCardNumber: dto.senderCardNumber,
                type: dto.transactionType,
                valuta: dto.valuta,
            },
        });

        await this.amqpConnection.publish(
            "transaction-exchange",
            "transaction.created",
            {
                recipientCardNumber: transaction.recipientCardNumber,
                senderCardNumber: transaction.senderCardNumber,
                amount: transaction.amount,
                valuta: transaction.valuta,
                type: transaction.type,
                timestamp: new Date().toISOString(),
            },
        );

        return transaction;
    }

    public async transactions(numbersCards: string[], limit: string) {
        const queryLimit = limit ? parseInt(limit) : undefined;
        const data = await this.prismaService.transactions.findMany({
            where: {
                OR: [
                    { senderCardNumber: { in: numbersCards } },
                    { recipientCardNumber: { in: numbersCards } },
                ],
            },
            orderBy: { id: "desc" },
            take: queryLimit,
        });

        return data.map((tx) => ({
            ...tx,
            id: tx.id.toString(),
        }));
    }
}
