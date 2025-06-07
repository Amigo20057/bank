import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Decimal } from "prisma/__generate__/runtime/library";
import { CardService } from "src/card/card.service";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { TakeLoanDto } from "./dto/take-loan.dto";
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

    public async takeLoan(dto: TakeLoanDto): Promise<{ success: boolean }> {
        const receivedCard = await this.cardService.findCardByNumberCard(
            dto.cardNumber,
        );

        if (!receivedCard) {
            throw new NotFoundException("Wrong card id");
        }

        if (receivedCard.cvvCode !== dto.cvvCode) {
            throw new BadRequestException("Invalid CVV code");
        }

        const decimalAmount = new Decimal(dto.amount);
        const interestRate = new Decimal(dto.interestRate);
        const totalRepayment = decimalAmount.mul(interestRate.div(100).add(1));
        const monthlyPayment = totalRepayment.div(dto.termMonths);

        await this.cardService.updateCardBalanceTx(
            receivedCard.id,
            receivedCard.balance.add(decimalAmount),
        );

        const transaction = {
            recipientCardNumber: receivedCard.cardNumber,
            amount: dto.amount,
            valuta: receivedCard.valuta,
            transactionType: "LOAN",
            transactionStatus: "PROCESSED",
        };

        try {
            await Promise.all([
                this.transactionClient.createTransaction(transaction),
                this.cardService.prisma.loan.create({
                    data: {
                        amount: decimalAmount,
                        interestRate: interestRate,
                        termMonths: dto.termMonths,
                        purpose: dto.purpose,
                        totalRepayment,
                        monthlyPayment,
                        cardId: receivedCard.id,
                    },
                }),
            ]);
        } catch (error) {
            await this.cardService.updateCardBalanceTx(
                receivedCard.id,
                receivedCard.balance,
            );
            throw new BadRequestException(
                "Loan creation or transaction failed. Balance rolled back.",
            );
        }

        return { success: true };
    }

    public async payLoan(data: {
        loanId: number;
        amount: number;
        cardNumber: string;
        cvvCode: number;
    }): Promise<{ success: boolean }> {
        const { loanId, amount, cardNumber, cvvCode } = data;

        const receivedCard = await this.cardService.prisma.card.findUnique({
            where: { cardNumber },
        });

        const loan = await this.cardService.prisma.loan.findUnique({
            where: { id: loanId },
        });

        if (!receivedCard) {
            throw new NotFoundException("Card not found");
        }

        if (!loan) {
            throw new NotFoundException("Loan not found");
        }

        if (loan.status !== "ACTIVE") {
            throw new BadRequestException("Loan was already repaid");
        }

        if (receivedCard.cvvCode !== cvvCode) {
            throw new BadRequestException("Incorrect CVV code");
        }

        const decimalAmount = new Decimal(amount);
        if (receivedCard.balance.lessThan(decimalAmount)) {
            throw new BadRequestException("Insufficient funds");
        }

        const remainingRepayment = new Decimal(loan.totalRepayment);

        const newRepayment = remainingRepayment.sub(decimalAmount);
        const isFullyPaid = newRepayment.lessThanOrEqualTo(0);

        try {
            await this.cardService.$transaction([
                this.cardService.updateCardBalanceTx(
                    receivedCard.id,
                    receivedCard.balance.sub(decimalAmount),
                ),
                this.cardService.prisma.loan.update({
                    where: { id: loanId },
                    data: {
                        totalRepayment: isFullyPaid
                            ? new Decimal(0)
                            : newRepayment,
                        status: isFullyPaid ? "PAID_OFF" : "ACTIVE",
                    },
                }),
            ]);

            const transaction = {
                senderCardNumber: cardNumber,
                amount,
                valuta: receivedCard.valuta,
                transactionType: "LOAN",
                transactionStatus: "PROCESSED",
            };

            await this.transactionClient.createTransaction(transaction);

            return { success: true };
        } catch (error) {
            await this.cardService.updateCardBalanceTx(
                receivedCard.id,
                receivedCard.balance,
            );

            throw new BadRequestException(
                "Payment processing failed. Balance rolled back.",
            );
        }
    }
}
