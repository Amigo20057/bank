import { IsNumber, IsString } from "class-validator";

export class CreateTransferDto {
    @IsString()
    recipientCardNumber: string;

    @IsString()
    senderCardNumber: string;

    @IsNumber()
    cvvCode: number;

    amount: number;

    @IsString()
    valuta: string;
}
