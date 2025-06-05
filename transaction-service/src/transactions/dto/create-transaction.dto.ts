import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TransactionStatus, TransactionType } from "prisma/__generate__";

export class CreateTransactionDto {
    id?: number;

    @IsString()
    recipientCardNumber: string;

    @IsString()
    @IsOptional()
    senderCardNumber?: string;

    amount: number;

    @IsString()
    valuta: string;

    @Transform(({ value }) => "" + value)
    @IsEnum(TransactionType)
    transactionType: TransactionType;

    @IsOptional()
    @Transform(({ value }) => "" + value)
    @IsEnum(TransactionStatus)
    transactionStatus?: TransactionStatus;
}
