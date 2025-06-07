import {
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
} from "class-validator";

export class TakeLoanDto {
    @IsNumber()
    @IsPositive()
    @Min(100)
    @Max(20000)
    amount: number;

    @IsNumber()
    @IsPositive()
    @Min(0.1)
    @Max(100)
    interestRate: number;

    @IsInt()
    @Min(1)
    @Max(60)
    termMonths: number;

    @IsOptional()
    @IsString()
    purpose?: string;

    @IsString()
    cardNumber: string;

    @IsNumber()
    cvvCode: number;
}
