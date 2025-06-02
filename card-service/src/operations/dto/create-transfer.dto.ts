import { IsNumber, IsString } from "class-validator";

export class CreateTransferDto {
    @IsString()
    receivedCardNumber: string;

    @IsString()
    senderCardNumber: string;

    @IsNumber()
    cvvCode: number;

    amount: number;

    @IsString()
    valuta: string;
}
