import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateTransferDto } from "src/operations/dto/create-transfer.dto";
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
}
