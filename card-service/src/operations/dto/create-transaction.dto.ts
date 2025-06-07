import { IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    id?: number;

    @IsString()
    recipientCardNumber?: string;

    @IsString()
    @IsOptional()
    senderCardNumber?: string;

    amount: number;

    @IsString()
    valuta: string;

    transactionType: any;

    transactionStatus?: any;
}
