import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/__generate__";
import { Decimal } from "prisma/__generate__/runtime/library";
import { serializePrisma } from "src/common/utils/serializePrisma";
import { PrismaService } from "src/prisma/prisma.service";
const generateCreditCard = require("generate-visa-card-number-test");

@Injectable()
export class CardService {
    public constructor(private readonly prisma: PrismaService) {}

    public async findCardByNumberCard(cardNumber: string) {
        return await this.prisma.card.findUnique({
            where: {
                cardNumber,
            },
        });
    }

    public async create(userId: string) {
        const bin = "414141";
        const generatedCard = generateCreditCard(bin);
        const [month, year] = generatedCard.exp.split("-");
        const validateDate = new Date(parseInt(year), parseInt(month) - 1);
        const card = await this.prisma.card.create({
            data: {
                cardNumber: generatedCard.number,
                cvvCode: parseInt(generatedCard.cvv),
                cardValidatePeriod: validateDate,
                userId,
            },
        });

        return serializePrisma(card);
    }

    public async allCards(userId: string) {
        const cards = await this.prisma.card.findMany({
            where: {
                userId,
            },
        });
        return serializePrisma(cards);
    }

    public async getCardById(userId: string, cardId: string) {
        const card = await this.prisma.card.findUnique({
            where: {
                userId,
                id: Number(cardId),
            },
        });
        return serializePrisma(card);
    }

    updateCardBalanceTx(cardId: bigint, newBalance: Decimal) {
        return this.prisma.card.update({
            where: { id: cardId },
            data: { balance: newBalance },
        });
    }

    $transaction(actions: Prisma.PrismaPromise<any>[]) {
        return this.prisma.$transaction(actions);
    }

    public async blockCard() {}

    public async deleteCard() {}

    public async updateCard() {}
}
