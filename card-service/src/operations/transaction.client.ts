import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientGrpc, Transport } from "@nestjs/microservices";
import { join } from "path";
import { firstValueFrom, Observable } from "rxjs";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

interface TransactionServiceGrpc {
    CreateTransaction(data: CreateTransactionDto): Observable<any>;
}

@Injectable()
export class TransactionClientService implements OnModuleInit {
    @Client({
        transport: Transport.GRPC,
        options: {
            package: "transaction",
            protoPath: join(process.cwd(), "src/proto/transaction.proto"),
            url: "localhost:50052",
        },
    })
    private client: ClientGrpc;
    private transactionService: TransactionServiceGrpc;

    onModuleInit() {
        this.transactionService =
            this.client.getService<TransactionServiceGrpc>(
                "TransactionService",
            );
        console.log("Connected to transaction-service via gRPC");
    }

    async createTransaction(data: CreateTransactionDto) {
        return firstValueFrom(this.transactionService.CreateTransaction(data));
    }
}
