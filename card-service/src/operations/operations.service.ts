import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Decimal } from "prisma/__generate__/runtime/library";
import { CardService } from "src/card/card.service";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { TransactionClientService } from "./transaction.client";

@Injectable()
export class OperationsService {
    public constructor(
        private readonly cardService: CardService,
        private readonly transactionClient: TransactionClientService,
    ) {}

    public async transfer(
        dto: CreateTransferDto,
    ): Promise<{ success: boolean }> {
        const {
            recipientCardNumber,
            senderCardNumber,
            amount,
            cvvCode,
            valuta,
        } = dto;

        const receivedCard =
            await this.cardService.findCardByNumberCard(recipientCardNumber);
        const senderCard =
            await this.cardService.findCardByNumberCard(senderCardNumber);

        if (!receivedCard || !senderCard) {
            throw new NotFoundException("Wrong card number");
        }
        if (senderCard.cvvCode !== cvvCode) {
            throw new BadRequestException("Invalid CVV code");
        }
        if (senderCard.valuta !== valuta || receivedCard.valuta !== valuta) {
            throw new BadRequestException("Currency mismatch");
        }

        const decimalAmount = new Decimal(amount);
        if (senderCard.balance.lessThan(decimalAmount)) {
            throw new BadRequestException("Insufficient funds");
        }

        const [updatedSenderCard, updatedReceiverCard] =
            await this.cardService.$transaction([
                this.cardService.updateCardBalanceTx(
                    senderCard.id,
                    senderCard.balance.sub(decimalAmount),
                ),
                this.cardService.updateCardBalanceTx(
                    receivedCard.id,
                    receivedCard.balance.add(decimalAmount),
                ),
            ]);

        const transaction = {
            recipientCardNumber,
            senderCardNumber,
            amount,
            valuta,
            transactionType: "TRANSFER",
            transactionStatus: "PROCESSED",
        };

        try {
            await this.transactionClient.createTransaction(transaction);
        } catch (error) {
            await this.cardService.$transaction([
                this.cardService.updateCardBalanceTx(
                    senderCard.id,
                    senderCard.balance,
                ),
                this.cardService.updateCardBalanceTx(
                    receivedCard.id,
                    receivedCard.balance,
                ),
            ]);
            throw new BadRequestException(
                "Transaction service failed. Rolled back balances.",
            );
        }

        return { success: true };
    }
}
