import { Body, Controller } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @GrpcMethod("TransactionService", "CreateTransaction")
    public async createTransaction(@Body() dto: CreateTransactionDto) {
        try {
            return await this.transactionsService.createTransaction(dto);
        } catch (error) {
            console.error("GRPC CreateTransaction Error: ", error);
            throw new RpcException("Error Create Transaction");
        }
    }
}
