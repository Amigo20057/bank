import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateTransferDto } from "src/operations/dto/create-transfer.dto";
import { TakeLoanDto } from "src/operations/dto/take-loan.dto";
import { OperationsService } from "src/operations/operations.service";
import { CardService } from "./card.service";

@Controller("card")
export class CardController {
    constructor(
        private readonly cardService: CardService,
        private readonly operationsService: OperationsService,
    ) {}

    @Post("create")
    @UseGuards(JwtAuthGuard)
    public create(@Req() req: Request) {
        // console.log(req["id"]);
        return this.cardService.create(req["id"]);
    }

    @Get("/cards")
    @UseGuards(JwtAuthGuard)
    public allCards(@Req() req: Request) {
        // console.log(req["id"]);
        return this.cardService.allCards(req["id"]);
    }

    @Get("/by-id/:id")
    @UseGuards(JwtAuthGuard)
    public cardById(@Req() req: Request, @Param("id") cardId: string) {
        // console.log("User id: ", req["id"]);
        // console.log("Card id: ", cardId);
        return this.cardService.getCardById(req["id"], cardId);
    }

    @Post("transfer")
    @UseGuards(JwtAuthGuard)
    public transfer(@Body() dto: CreateTransferDto) {
        return this.operationsService.transfer(dto);
    }

    @Post("loan")
    @UseGuards(JwtAuthGuard)
    public loan(@Body() dto: TakeLoanDto) {
        return this.operationsService.takeLoan(dto);
    }

    @Patch("pay-loan")
    @UseGuards(JwtAuthGuard)
    public payLoan(
        @Body()
        data: {
            loanId: number;
            amount: number;
            cardNumber: string;
            cvvCode: number;
        },
    ) {
        return this.operationsService.payLoan(data);
    }

    @Delete("/delete")
    @UseGuards(JwtAuthGuard)
    public deleteCard(@Body() data: { cardId: number; cvvCode: number }) {
        return this.cardService.deleteCard(data.cardId, data.cvvCode);
    }

    @Get("/loans/:cardNumber")
    @UseGuards(JwtAuthGuard)
    public loans(@Req() req: Request, @Param("cardNumber") cardNumber: string) {
        return this.cardService.getLoans(cardNumber, req["id"]);
    }
}
