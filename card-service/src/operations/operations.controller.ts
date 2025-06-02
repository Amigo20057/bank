import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { OperationsService } from "./operations.service";

@Controller("operations")
export class OperationsController {
    constructor(private readonly operationsService: OperationsService) {}

    @Post("transfer")
    @UseGuards(JwtAuthGuard)
    public transfer(@Body() dto: CreateTransferDto) {
        return this.operationsService.transfer(dto);
    }
}
